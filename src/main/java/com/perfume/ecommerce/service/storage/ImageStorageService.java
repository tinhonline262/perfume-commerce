package com.perfume.ecommerce.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    String store(MultipartFile multipartFile);
}
