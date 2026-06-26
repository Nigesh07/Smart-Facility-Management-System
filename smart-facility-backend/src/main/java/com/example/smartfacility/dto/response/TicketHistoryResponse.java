package com.example.smartfacility.dto.response;

import com.example.smartfacility.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketHistoryResponse {
    private Long id;
    private TicketStatus previousStatus;
    private TicketStatus currentStatus;
    private Long updatedById;
    private String updatedByName;
    private String remarks;
    private LocalDateTime actionDate;
}
