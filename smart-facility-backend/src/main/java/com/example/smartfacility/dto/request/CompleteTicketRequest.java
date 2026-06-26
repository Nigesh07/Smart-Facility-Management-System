package com.example.smartfacility.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompleteTicketRequest {

    @NotBlank(message = "Work remarks are required to complete a ticket")
    private String workRemarks;

    // Optional - Cloudinary secure URL uploaded beforehand via /api/uploads/ticket-completion
    private String completionImageUrl;
}
