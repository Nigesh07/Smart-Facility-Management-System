package com.example.smartfacility.repository;

import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TechnicianSpecialization;
import com.example.smartfacility.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndActiveTrue(Role role);

    List<User> findByRoleAndSpecializationAndActiveTrue(Role role, TechnicianSpecialization specialization);
}
