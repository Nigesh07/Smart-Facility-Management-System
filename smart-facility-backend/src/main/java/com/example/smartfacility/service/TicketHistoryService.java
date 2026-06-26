package com.example.smartfacility.service;

import com.example.smartfacility.dto.response.TicketHistoryResponse;
import com.example.smartfacility.enums.TicketStatus;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.User;

import java.util.List;

public interface TicketHistoryService {

    void recordHistory(Ticket ticket, TicketStatus previousStatus, TicketStatus currentStatus, User updatedBy, String remarks);

    List<TicketHistoryResponse> getHistoryForTicket(Long ticketId, String requesterEmail);
}
