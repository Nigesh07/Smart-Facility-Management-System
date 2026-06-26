package com.example.smartfacility.controller;

import com.example.smartfacility.dto.request.AssignTicketRequest;
import com.example.smartfacility.dto.request.CompleteTicketRequest;
import com.example.smartfacility.dto.request.CreateTicketRequest;
import com.example.smartfacility.dto.request.UpdateTicketStatusRequest;
import com.example.smartfacility.dto.response.ApiResponse;
import com.example.smartfacility.dto.response.TicketHistoryResponse;
import com.example.smartfacility.dto.response.TicketResponse;
import com.example.smartfacility.service.TicketHistoryService;
import com.example.smartfacility.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketHistoryService ticketHistoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(Authentication authentication,
                                                                       @Valid @RequestBody CreateTicketRequest request) {
        TicketResponse created = ticketService.createTicket(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Ticket created successfully", created));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getMyTickets(authentication.getName())));
    }

    @GetMapping("/coordinator")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getCoordinatorTickets(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getCoordinatorTickets(authentication.getName())));
    }

    @GetMapping("/assigned")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAssignedTickets(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getAssignedTickets(authentication.getName())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getAllTickets()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketById(id, authentication.getName())));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTechnician(@PathVariable Long id,
                                                                           Authentication authentication,
                                                                           @Valid @RequestBody AssignTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully",
                ticketService.assignTechnician(id, authentication.getName(), request)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> startWork(@PathVariable Long id,
                                                                    Authentication authentication,
                                                                    @RequestBody UpdateTicketStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated to IN_PROGRESS",
                ticketService.startWork(id, authentication.getName(), request)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<TicketResponse>> completeTicket(@PathVariable Long id,
                                                                         Authentication authentication,
                                                                         @Valid @RequestBody CompleteTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ticket marked as completed",
                ticketService.completeTicket(id, authentication.getName(), request)));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<ApiResponse<TicketResponse>> closeTicket(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Ticket closed successfully",
                ticketService.closeTicket(id, authentication.getName())));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<TicketHistoryResponse>>> getTicketHistory(@PathVariable Long id,
                                                                                        Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketHistoryService.getHistoryForTicket(id, authentication.getName())));
    }
}
