package com.example.smartfacility.dto.response;

import com.example.smartfacility.enums.Priority;
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
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String location;
    private Priority priority;
    private TicketStatus status;
    private String issueImageUrl;
    private String completionImageUrl;
    private String workRemarks;

    private Long createdById;
    private String createdByName;

    private Long assignedToId;
    private String assignedToName;

    private Long coordinatorId;
    private String coordinatorName;

    private Long categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;
}
