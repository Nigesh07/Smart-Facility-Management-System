package com.example.smartfacility.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCategoryStatusRequest {

    @NotNull(message = "Active status is required")
    private Boolean active;
}
