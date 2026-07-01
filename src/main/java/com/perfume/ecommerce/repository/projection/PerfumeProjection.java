package com.perfume.ecommerce.repository.projection;

import org.springframework.beans.factory.annotation.Value;

public interface PerfumeProjection {
    Long getId();
    String getPerfumeTitle();
    String getPerfumer();
    Integer getPrice();
    String getFilename();
    Double getPerfumeRating();
    String getVolume();
    Integer getInventory();
    Integer getSoldQuantity();
    Integer getLowStockThreshold();
    
    @Value("#{target.reviews.size()}")
    Integer getReviewsCount();

    void setPerfumer(String perfumer);
    void setPerfumeGender(String perfumeGender);
    void setPrice(Integer price);
}
