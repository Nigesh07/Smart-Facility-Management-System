package com.example.smartfacility.service.impl;

import com.example.smartfacility.dto.response.NotificationResponse;
import com.example.smartfacility.enums.NotificationType;
import com.example.smartfacility.exception.ResourceNotFoundException;
import com.example.smartfacility.exception.UnauthorizedException;
import com.example.smartfacility.model.Notification;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.User;
import com.example.smartfacility.repository.NotificationRepository;
import com.example.smartfacility.repository.UserRepository;
import com.example.smartfacility.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(User user, Ticket ticket, NotificationType type, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .ticket(ticket)
                .type(type)
                .message(message)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public long getUnreadCount(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Override
    public void markAsRead(Long notificationId, String email) {
        User user = getUserByEmail(email);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String email) {
        User user = getUserByEmail(email);
        List<Notification> unread = notificationRepository.findByUserAndReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .ticketId(n.getTicket() != null ? n.getTicket().getId() : null)
                .ticketNumber(n.getTicket() != null ? n.getTicket().getTicketNumber() : null)
                .createdAt(n.getCreatedAt())
                .build();
    }
}
