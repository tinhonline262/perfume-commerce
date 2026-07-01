package com.perfume.ecommerce.dto.order;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Status must not be blank")
    private String status;
}
