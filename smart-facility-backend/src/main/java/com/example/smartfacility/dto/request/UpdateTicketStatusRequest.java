package com.example.smartfacility.dto.request;

import lombok.Data;

@Data
public class UpdateTicketStatusRequest {

    // Optional remarks when technician starts work
    private String remarks;
}
