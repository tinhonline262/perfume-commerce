package com.perfume.ecommerce.service.storage;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.perfume.ecommerce.configuration.properties.S3StorageProperties;
import com.perfume.ecommerce.exception.ApiRequestException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.InvalidPathException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import static com.perfume.ecommerce.constants.ErrorMessage.FILE_UPLOAD_FAILED;

@Service
@RequiredArgsConstructor
public class S3ImageStorageService implements ImageStorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3ImageStorageService.class);
    private static final String EMPTY_IMAGE = "empty.jpg";

    private final AmazonS3 amazonS3Client;
    private final S3StorageProperties s3StorageProperties;

    @Override
    public String store(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return getImageUrl(EMPTY_IMAGE);
        }

        Path tempFile = null;
        try {
            String cleanFilename = cleanFilename(multipartFile);
            String fileName = UUID.randomUUID().toString() + "." + cleanFilename;
            tempFile = Files.createTempFile("perfume-", "-" + safeTempSuffix(cleanFilename));
            multipartFile.transferTo(tempFile.toFile());
            amazonS3Client.putObject(new PutObjectRequest(s3StorageProperties.getBucketName(), fileName, tempFile.toFile()));
            return getImageUrl(fileName);
        } catch (IOException | InvalidPathException | AmazonClientException | IllegalStateException exception) {
            throw new ApiRequestException(FILE_UPLOAD_FAILED, HttpStatus.BAD_REQUEST);
        } finally {
            deleteTempFile(tempFile);
        }
    }

    private String cleanFilename(MultipartFile multipartFile) {
        String originalFilename = multipartFile.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new ApiRequestException(FILE_UPLOAD_FAILED, HttpStatus.BAD_REQUEST);
        }

        String filename = Paths.get(originalFilename).getFileName().toString();
        String cleanFilename = StringUtils.cleanPath(filename);
        if (cleanFilename.contains("..")) {
            throw new ApiRequestException(FILE_UPLOAD_FAILED, HttpStatus.BAD_REQUEST);
        }
        return cleanFilename;
    }

    private String safeTempSuffix(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String getImageUrl(String filename) {
        String publicUrl = trimTrailingSlash(s3StorageProperties.getPublicUrl());
        String encodedFilename = UriUtils.encodePathSegment(filename, StandardCharsets.UTF_8);
        return publicUrl + "/" + s3StorageProperties.getBucketName() + "/" + encodedFilename;
    }

    private String trimTrailingSlash(String value) {
        return value.replaceAll("/+$", "");
    }

    private void deleteTempFile(Path tempFile) {
        if (tempFile == null) {
            return;
        }

        try {
            Files.deleteIfExists(tempFile);
        } catch (IOException exception) {
            logger.warn("Unable to delete temporary upload file {}", tempFile, exception);
        }
    }
}
