package com.example.smartfacility.service.impl;

import com.example.smartfacility.dto.response.TicketHistoryResponse;
import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TicketStatus;
import com.example.smartfacility.exception.ResourceNotFoundException;
import com.example.smartfacility.exception.UnauthorizedException;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.TicketHistory;
import com.example.smartfacility.model.User;
import com.example.smartfacility.repository.TicketHistoryRepository;
import com.example.smartfacility.repository.TicketRepository;
import com.example.smartfacility.repository.UserRepository;
import com.example.smartfacility.service.TicketHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class TicketHistoryServiceImpl implements TicketHistoryService {

    private final TicketHistoryRepository ticketHistoryRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public void recordHistory(Ticket ticket, TicketStatus previousStatus, TicketStatus currentStatus, User updatedBy, String remarks) {
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .previousStatus(previousStatus)
                .currentStatus(currentStatus)
                .updatedBy(updatedBy)
                .remarks(remarks)
                .build();
        ticketHistoryRepository.save(history);
    }

    @Override
    public List<TicketHistoryResponse> getHistoryForTicket(Long ticketId, String requesterEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + requesterEmail));

        boolean isAuthorized = requester.getRole() == Role.ADMIN
                || (ticket.getCreatedBy() != null && ticket.getCreatedBy().getId().equals(requester.getId()))
                || (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(requester.getId()))
                || (ticket.getCoordinator() != null && ticket.getCoordinator().getId().equals(requester.getId()))
                || requester.getRole() == Role.COORDINATOR;

        if (!isAuthorized) {
            throw new UnauthorizedException("You are not authorized to view this ticket's history");
        }

        return ticketHistoryRepository.findByTicketOrderByActionDateAsc(ticket)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TicketHistoryResponse toResponse(TicketHistory history) {
        return TicketHistoryResponse.builder()
                .id(history.getId())
                .previousStatus(history.getPreviousStatus())
                .currentStatus(history.getCurrentStatus())
                .updatedById(history.getUpdatedBy() != null ? history.getUpdatedBy().getId() : null)
                .updatedByName(history.getUpdatedBy() != null ? history.getUpdatedBy().getFullName() : "System / Deleted User")
                .remarks(history.getRemarks())
                .actionDate(history.getActionDate())
                .build();
    }
}
