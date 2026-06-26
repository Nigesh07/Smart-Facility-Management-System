package com.example.smartfacility.service.impl;

import com.example.smartfacility.dto.request.AssignTicketRequest;
import com.example.smartfacility.dto.request.CompleteTicketRequest;
import com.example.smartfacility.dto.request.CreateTicketRequest;
import com.example.smartfacility.dto.request.UpdateTicketStatusRequest;
import com.example.smartfacility.dto.response.TicketResponse;
import com.example.smartfacility.enums.NotificationType;
import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TicketStatus;
import com.example.smartfacility.exception.BadRequestException;
import com.example.smartfacility.exception.ResourceNotFoundException;
import com.example.smartfacility.exception.UnauthorizedException;
import com.example.smartfacility.model.Category;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.User;
import com.example.smartfacility.repository.CategoryRepository;
import com.example.smartfacility.repository.TicketRepository;
import com.example.smartfacility.repository.UserRepository;
import com.example.smartfacility.service.NotificationService;
import com.example.smartfacility.service.TicketHistoryService;
import com.example.smartfacility.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TicketHistoryService ticketHistoryService;
    private final NotificationService notificationService;

    @Override
    public TicketResponse createTicket(String userEmail, CreateTicketRequest request) {
        User user = getUserByEmail(userEmail);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (!category.isActive()) {
            throw new BadRequestException("Selected category is not active");
        }

        Ticket ticket = Ticket.builder()
                .ticketNumber(generateTicketNumber())
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .priority(request.getPriority())
                .status(TicketStatus.PENDING)
                .issueImageUrl(request.getIssueImageUrl())
                .createdBy(user)
                .category(category)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        ticketHistoryService.recordHistory(saved, null, TicketStatus.PENDING, user, "Ticket created by user");

        notifyAllCoordinators(saved);

        return toResponse(saved);
    }

    @Override
    public List<TicketResponse> getMyTickets(String userEmail) {
        User user = getUserByEmail(userEmail);
        return ticketRepository.findByCreatedByOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<TicketResponse> getCoordinatorTickets(String coordinatorEmail) {
        User coordinator = getUserByEmail(coordinatorEmail);
        return ticketRepository.findCoordinatorRelevantTickets(coordinator)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<TicketResponse> getAssignedTickets(String technicianEmail) {
        User technician = getUserByEmail(technicianEmail);
        return ticketRepository.findByAssignedToOrderByCreatedAtDesc(technician)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public TicketResponse getTicketById(Long id, String requesterEmail) {
        Ticket ticket = getTicketOrThrow(id);
        User requester = getUserByEmail(requesterEmail);
        assertCanView(ticket, requester);
        return toResponse(ticket);
    }

    @Override
    public TicketResponse assignTechnician(Long ticketId, String coordinatorEmail, AssignTicketRequest request) {
        Ticket ticket = getTicketOrThrow(ticketId);
        User coordinator = getUserByEmail(coordinatorEmail);

        if (ticket.getStatus() != TicketStatus.PENDING) {
            throw new BadRequestException("Only PENDING tickets can be assigned to a technician");
        }

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + request.getTechnicianId()));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new BadRequestException("Selected user is not a technician");
        }

        if (!technician.isActive()) {
            throw new BadRequestException("Cannot assign an inactive technician");
        }

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setAssignedTo(technician);
        ticket.setCoordinator(coordinator);
        ticket.setStatus(TicketStatus.ASSIGNED);

        Ticket saved = ticketRepository.save(ticket);

        ticketHistoryService.recordHistory(saved, previousStatus, TicketStatus.ASSIGNED, coordinator,
                "Assigned to technician: " + technician.getFullName());

        notificationService.createNotification(technician, saved, NotificationType.TICKET_ASSIGNED,
                "You have been assigned ticket " + saved.getTicketNumber() + ": " + saved.getTitle());

        return toResponse(saved);
    }

    @Override
    public TicketResponse startWork(Long ticketId, String technicianEmail, UpdateTicketStatusRequest request) {
        Ticket ticket = getTicketOrThrow(ticketId);
        User technician = getUserByEmail(technicianEmail);

        assertAssignedTechnician(ticket, technician);

        if (ticket.getStatus() != TicketStatus.ASSIGNED) {
            throw new BadRequestException("Only ASSIGNED tickets can be moved to IN_PROGRESS");
        }

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        Ticket saved = ticketRepository.save(ticket);

        ticketHistoryService.recordHistory(saved, previousStatus, TicketStatus.IN_PROGRESS, technician,
                request.getRemarks() != null ? request.getRemarks() : "Technician started work");

        if (saved.getCoordinator() != null) {
            notificationService.createNotification(saved.getCoordinator(), saved, NotificationType.TICKET_IN_PROGRESS,
                    "Technician started work on ticket " + saved.getTicketNumber());
        }

        return toResponse(saved);
    }

    @Override
    public TicketResponse completeTicket(Long ticketId, String technicianEmail, CompleteTicketRequest request) {
        Ticket ticket = getTicketOrThrow(ticketId);
        User technician = getUserByEmail(technicianEmail);

        assertAssignedTechnician(ticket, technician);

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new BadRequestException("Only IN_PROGRESS tickets can be marked as COMPLETED");
        }

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.COMPLETED);
        ticket.setWorkRemarks(request.getWorkRemarks());
        ticket.setCompletionImageUrl(request.getCompletionImageUrl());

        Ticket saved = ticketRepository.save(ticket);

        ticketHistoryService.recordHistory(saved, previousStatus, TicketStatus.COMPLETED, technician,
                request.getWorkRemarks());

        if (saved.getCoordinator() != null) {
            notificationService.createNotification(saved.getCoordinator(), saved, NotificationType.TICKET_COMPLETED,
                    "Ticket " + saved.getTicketNumber() + " has been completed and is awaiting verification");
        }

        return toResponse(saved);
    }

    @Override
    public TicketResponse closeTicket(Long ticketId, String coordinatorEmail) {
        Ticket ticket = getTicketOrThrow(ticketId);
        User coordinator = getUserByEmail(coordinatorEmail);

        if (ticket.getStatus() != TicketStatus.COMPLETED) {
            throw new BadRequestException("Only COMPLETED tickets can be closed");
        }

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setClosedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        ticketHistoryService.recordHistory(saved, previousStatus, TicketStatus.CLOSED, coordinator,
                "Verified and closed by coordinator");

        notificationService.createNotification(saved.getCreatedBy(), saved, NotificationType.TICKET_CLOSED,
                "Your ticket " + saved.getTicketNumber() + " has been resolved and closed");

        return toResponse(saved);
    }

    // ---------- helpers ----------

    private void notifyAllCoordinators(Ticket ticket) {
        List<User> coordinators = userRepository.findByRoleAndActiveTrue(Role.COORDINATOR);
        for (User coordinator : coordinators) {
            notificationService.createNotification(coordinator, ticket, NotificationType.TICKET_CREATED,
                    "New ticket " + ticket.getTicketNumber() + " requires assignment: " + ticket.getTitle());
        }
    }

    private void assertCanView(Ticket ticket, User requester) {
        boolean canView = requester.getRole() == Role.ADMIN
                || requester.getRole() == Role.COORDINATOR
                || (ticket.getCreatedBy() != null && ticket.getCreatedBy().getId().equals(requester.getId()))
                || (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(requester.getId()));

        if (!canView) {
            throw new UnauthorizedException("You are not authorized to view this ticket");
        }
    }

    private void assertAssignedTechnician(Ticket ticket, User technician) {
        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().getId().equals(technician.getId())) {
            throw new UnauthorizedException("You are not the technician assigned to this ticket");
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private Ticket getTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private static final AtomicLong SEQUENCE = new AtomicLong(System.currentTimeMillis() % 100000);

    private String generateTicketNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        long seq = SEQUENCE.incrementAndGet();
        String candidate = "TKT-" + datePart + "-" + seq;
        while (ticketRepository.findByTicketNumber(candidate).isPresent()) {
            seq = SEQUENCE.incrementAndGet();
            candidate = "TKT-" + datePart + "-" + seq;
        }
        return candidate;
    }

    private TicketResponse toResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .location(ticket.getLocation())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .issueImageUrl(ticket.getIssueImageUrl())
                .completionImageUrl(ticket.getCompletionImageUrl())
                .workRemarks(ticket.getWorkRemarks())
                .createdById(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getId() : null)
                .createdByName(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getFullName() : null)
                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getFullName() : null)
                .coordinatorId(ticket.getCoordinator() != null ? ticket.getCoordinator().getId() : null)
                .coordinatorName(ticket.getCoordinator() != null ? ticket.getCoordinator().getFullName() : null)
                .categoryId(ticket.getCategory() != null ? ticket.getCategory().getId() : null)
                .categoryName(ticket.getCategory() != null ? ticket.getCategory().getName() : null)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .closedAt(ticket.getClosedAt())
                .build();
    }
}
