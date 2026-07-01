package com.perfume.ecommerce.service.impl;

import com.perfume.ecommerce.domain.Perfume;
import com.perfume.ecommerce.dto.perfume.PerfumeSearchRequest;
import com.perfume.ecommerce.enums.SearchPerfume;
import com.perfume.ecommerce.exception.ApiRequestException;
import com.perfume.ecommerce.repository.PerfumeRepository;
import com.perfume.ecommerce.repository.projection.PerfumeProjection;
import com.perfume.ecommerce.service.PerfumeService;
import com.perfume.ecommerce.service.storage.ImageStorageService;
import graphql.schema.DataFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

import static com.perfume.ecommerce.constants.ErrorMessage.PERFUME_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PerfumeServiceImpl implements PerfumeService {

    private final PerfumeRepository perfumeRepository;
    private final ImageStorageService imageStorageService;

    @Override
    public Perfume getPerfumeById(Long perfumeId) {
        return perfumeRepository.findById(perfumeId)
                .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    @Override
    public Page<PerfumeProjection> getAllPerfumes(Pageable pageable) {
        return perfumeRepository.findAllByOrderByIdAsc(pageable);
    }

    @Override
    public List<PerfumeProjection> getPerfumesByIds(List<Long> perfumesId) {
        return perfumeRepository.getPerfumesByIds(perfumesId);
    }

    @Override
    public Page<PerfumeProjection> findPerfumesByFilterParams(PerfumeSearchRequest filter, Pageable pageable) {
        Integer priceStart = null;
        Integer priceEnd = null;
        if (filter.getPrices() != null && filter.getPrices().size() >= 2) {
            priceStart = filter.getPrices().get(0);
            priceEnd = filter.getPrices().get(1);
        }
        return perfumeRepository.findPerfumesByFilterParams(
                filter.getPerfumers(),
                filter.getGenders(),
                priceStart,
                priceEnd,
                filter.getSortByPrice() != null ? filter.getSortByPrice() : false,
                pageable);
    }

    @Override
    public List<Perfume> findByPerfumer(String perfumer) {
        return perfumeRepository.findByPerfumerOrderByPriceDesc(perfumer);
    }

    @Override
    public List<Perfume> findByPerfumeGender(String perfumeGender) {
        return perfumeRepository.findByPerfumeGenderOrderByPriceDesc(perfumeGender);
    }

    @Override
    public Page<PerfumeProjection> findByInputText(SearchPerfume searchType, String text, Pageable pageable) {
        if (searchType == null || text == null || text.trim().isEmpty()) {
            return perfumeRepository.findAllByOrderByIdAsc(pageable);
        }
        if (searchType.equals(SearchPerfume.BRAND)) {
            return perfumeRepository.findByPerfumer(text, pageable);
        } else if (searchType.equals(SearchPerfume.PERFUME_TITLE)) {
            return perfumeRepository.findByPerfumeTitle(text, pageable);
        } else {
            return perfumeRepository.findByManufacturerCountry(text, pageable);
        }
    }

    @Override
    @Transactional
    public Perfume savePerfume(Perfume perfume, MultipartFile multipartFile) {
        if (perfume.getId() != null) {
            // It's an update
            Perfume existingPerfume = perfumeRepository.findById(perfume.getId())
                    .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));

            existingPerfume.setPerfumeTitle(perfume.getPerfumeTitle());
            existingPerfume.setPerfumer(perfume.getPerfumer());
            existingPerfume.setYear(perfume.getYear());
            existingPerfume.setCountry(perfume.getCountry());
            existingPerfume.setPerfumeGender(perfume.getPerfumeGender());
            existingPerfume.setFragranceTopNotes(perfume.getFragranceTopNotes());
            existingPerfume.setFragranceMiddleNotes(perfume.getFragranceMiddleNotes());
            existingPerfume.setFragranceBaseNotes(perfume.getFragranceBaseNotes());
            existingPerfume.setPrice(perfume.getPrice());
            existingPerfume.setVolume(perfume.getVolume());
            existingPerfume.setType(perfume.getType());
            existingPerfume.setInventory(perfume.getInventory());

            if (multipartFile != null && !multipartFile.isEmpty()) {
                existingPerfume.setFilename(imageStorageService.store(multipartFile));
            } else if (perfume.getFilename() != null && !perfume.getFilename().isEmpty()) {
                existingPerfume.setFilename(perfume.getFilename());
            }

            return perfumeRepository.save(existingPerfume);
        } else {
            // It's a new perfume, always set filename (could be empty or a default image from storage service)
            perfume.setFilename(imageStorageService.store(multipartFile));
            return perfumeRepository.save(perfume);
        }
    }

    @Override
    @Transactional
    public String deletePerfume(Long perfumeId) {
        Perfume perfume = perfumeRepository.findById(perfumeId)
                .orElseThrow(() -> new ApiRequestException(PERFUME_NOT_FOUND, HttpStatus.NOT_FOUND));
        perfumeRepository.delete(perfume);
        return "Perfume deleted successfully";
    }

    @Override
    public DataFetcher<Perfume> getPerfumeByQuery() {
        return dataFetchingEnvironment -> {
            Long perfumeId = Long.parseLong(dataFetchingEnvironment.getArgument("id"));
            return perfumeRepository.findById(perfumeId).get();
        };
    }

    @Override
    public DataFetcher<List<PerfumeProjection>> getAllPerfumesByQuery() {
        return dataFetchingEnvironment -> perfumeRepository.findAllByOrderByIdAsc();
    }

    @Override
    public DataFetcher<List<Perfume>> getAllPerfumesByIdsQuery() {
        return dataFetchingEnvironment -> {
            List<String> objects = dataFetchingEnvironment.getArgument("ids");
            List<Long> perfumesId = objects.stream()
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            return perfumeRepository.findByIdIn(perfumesId);
        };
    }
}
