package com.example.smartfacility.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTicketRequest {

    @NotNull(message = "Technician is required")
    private Long technicianId;
}
