package com.example.smartfacility.repository;

import com.example.smartfacility.model.Ticket;
import com.example.smartfacility.model.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketHistoryRepository extends JpaRepository<TicketHistory, Long> {

    List<TicketHistory> findByTicketOrderByActionDateAsc(Ticket ticket);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE TicketHistory th SET th.updatedBy = null WHERE th.updatedBy = :user")
    void nullifyUpdatedBy(@org.springframework.data.repository.query.Param("user") com.example.smartfacility.model.User user);
}
