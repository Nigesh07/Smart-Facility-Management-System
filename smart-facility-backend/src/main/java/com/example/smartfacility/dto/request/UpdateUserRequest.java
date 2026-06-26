package com.example.smartfacility.dto.request;

import com.example.smartfacility.enums.TechnicianSpecialization;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;

    private TechnicianSpecialization specialization;
}
