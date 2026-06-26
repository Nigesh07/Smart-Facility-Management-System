package com.example.smartfacility.dto.response;

import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TechnicianSpecialization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private boolean active;
    private String profileImageUrl;
    private TechnicianSpecialization specialization;
    private Long activeAssignedTicketCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
