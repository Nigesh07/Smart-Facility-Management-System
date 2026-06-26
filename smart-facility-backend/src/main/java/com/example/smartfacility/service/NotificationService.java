package com.example.smartfacility.service;

import com.example.smartfacility.dto.response.NotificationResponse;
import com.example.smartfacility.enums.NotificationType;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.User;

import java.util.List;

public interface NotificationService {

    void createNotification(User user, Ticket ticket, NotificationType type, String message);

    List<NotificationResponse> getMyNotifications(String email);

    long getUnreadCount(String email);

    void markAsRead(Long notificationId, String email);

    void markAllAsRead(String email);
}
