package com.example.smartfacility.dto.response;

import com.example.smartfacility.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String message;
    private NotificationType type;
    private boolean read;
    private Long ticketId;
    private String ticketNumber;
    private LocalDateTime createdAt;
}
