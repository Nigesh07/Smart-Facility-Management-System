package com.example.smartfacility.service;

import com.example.smartfacility.dto.request.AssignTicketRequest;
import com.example.smartfacility.dto.request.CompleteTicketRequest;
import com.example.smartfacility.dto.request.CreateTicketRequest;
import com.example.smartfacility.dto.request.UpdateTicketStatusRequest;
import com.example.smartfacility.dto.response.TicketResponse;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(String userEmail, CreateTicketRequest request);

    List<TicketResponse> getMyTickets(String userEmail);

    List<TicketResponse> getCoordinatorTickets(String coordinatorEmail);

    List<TicketResponse> getAssignedTickets(String technicianEmail);

    List<TicketResponse> getAllTickets();

    TicketResponse getTicketById(Long id, String requesterEmail);

    TicketResponse assignTechnician(Long ticketId, String coordinatorEmail, AssignTicketRequest request);

    TicketResponse startWork(Long ticketId, String technicianEmail, UpdateTicketStatusRequest request);

    TicketResponse completeTicket(Long ticketId, String technicianEmail, CompleteTicketRequest request);

    TicketResponse closeTicket(Long ticketId, String coordinatorEmail);
}
