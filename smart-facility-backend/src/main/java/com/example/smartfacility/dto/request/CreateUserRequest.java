package com.example.smartfacility.dto.request;

import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TechnicianSpecialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Temporary password is required")
    private String password;

    private String phoneNumber;

    @NotNull(message = "Role is required")
    private Role role;

    // Only applicable when role = TECHNICIAN
    private TechnicianSpecialization specialization;
}
