package com.example.smartfacility.repository;

import com.example.smartfacility.enums.TicketStatus;
import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<Ticket> findByAssignedToOrderByCreatedAtDesc(User assignedTo);

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    long countByAssignedToAndStatusIn(User assignedTo, List<TicketStatus> statuses);

    @Query("SELECT t FROM Ticket t WHERE t.status = 'PENDING' OR t.coordinator = :coordinator ORDER BY t.createdAt DESC")
    List<Ticket> findCoordinatorRelevantTickets(@Param("coordinator") User coordinator);

    long countByStatus(TicketStatus status);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Ticket t SET t.createdBy = null WHERE t.createdBy = :user")
    void nullifyCreatedBy(@Param("user") User user);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Ticket t SET t.assignedTo = null WHERE t.assignedTo = :user")
    void nullifyAssignedTo(@Param("user") User user);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Ticket t SET t.coordinator = null WHERE t.coordinator = :user")
    void nullifyCoordinator(@Param("user") User user);
}
