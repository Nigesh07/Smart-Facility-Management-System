package com.example.smartfacility.dto.request;

import com.example.smartfacility.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Category is required")
    private Long categoryId;

    // Optional - Cloudinary secure URL uploaded beforehand via /api/uploads/ticket-issue
    private String issueImageUrl;
}
