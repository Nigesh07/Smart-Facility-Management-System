package com.example.smartfacility.service.impl;

import com.example.smartfacility.dto.request.ChangePasswordRequest;
import com.example.smartfacility.dto.request.CreateUserRequest;
import com.example.smartfacility.dto.request.UpdateUserRequest;
import com.example.smartfacility.dto.response.UserResponse;
import com.example.smartfacility.enums.Role;
import com.example.smartfacility.enums.TechnicianSpecialization;
import com.example.smartfacility.enums.TicketStatus;
import com.example.smartfacility.exception.BadRequestException;
import com.example.smartfacility.exception.ResourceNotFoundException;
import com.example.smartfacility.exception.UnauthorizedException;
import com.example.smartfacility.model.User;
import com.example.smartfacility.repository.TicketRepository;
import com.example.smartfacility.repository.UserRepository;
import com.example.smartfacility.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final com.example.smartfacility.repository.TicketHistoryRepository ticketHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<TicketStatus> ACTIVE_STATUSES = List.of(
            TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS
    );

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("A user with this email already exists");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot create another ADMIN account through this endpoint");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .active(true)
                .specialization(request.getRole() == Role.TECHNICIAN ? request.getSpecialization() : null)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        return toResponse(getUserOrThrow(id));
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = getUserOrThrow(id);
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (user.getRole() == Role.TECHNICIAN) {
            user.setSpecialization(request.getSpecialization());
        }
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUserStatus(Long id, boolean active) {
        User user = getUserOrThrow(id);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot deactivate an ADMIN account");
        }
        user.setActive(active);
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUserRole(Long id, Role role) {
        User user = getUserOrThrow(id);
        if (user.getRole() == Role.ADMIN || role == Role.ADMIN) {
            throw new BadRequestException("Cannot change role to or from ADMIN");
        }
        user.setRole(role);
        if (role != Role.TECHNICIAN) {
            user.setSpecialization(null);
        }
        return toResponse(userRepository.save(user));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id) {
        User user = getUserOrThrow(id);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete an ADMIN account");
        }
        
        ticketRepository.nullifyCreatedBy(user);
        ticketRepository.nullifyAssignedTo(user);
        ticketRepository.nullifyCoordinator(user);
        
        ticketHistoryRepository.nullifyUpdatedBy(user);
        
        userRepository.delete(user);
    }
    @Override
    public UserResponse getProfile(String email) {
        return toResponse(getUserByEmailOrThrow(email));
    }

    @Override
    public UserResponse updateProfile(String email, UpdateUserRequest request) {
        User user = getUserByEmailOrThrow(email);
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (user.getRole() == Role.TECHNICIAN) {
            user.setSpecialization(request.getSpecialization());
        }
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateProfileImage(String email, String imageUrl) {
        User user = getUserByEmailOrThrow(email);
        user.setProfileImageUrl(imageUrl);
        return toResponse(userRepository.save(user));
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmailOrThrow(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public List<UserResponse> getAvailableTechnicians(TechnicianSpecialization specialization) {
        List<User> matching = specialization != null
                ? userRepository.findByRoleAndSpecializationAndActiveTrue(Role.TECHNICIAN, specialization)
                : List.of();

        List<User> generalMaintenance = userRepository.findByRoleAndSpecializationAndActiveTrue(
                Role.TECHNICIAN, TechnicianSpecialization.GENERAL_MAINTENANCE);

        List<User> combined = new java.util.ArrayList<>(matching);
        for (User gm : generalMaintenance) {
            if (combined.stream().noneMatch(u -> u.getId().equals(gm.getId()))) {
                combined.add(gm);
            }
        }

        if (combined.isEmpty()) {
            combined = userRepository.findByRoleAndActiveTrue(Role.TECHNICIAN);
        }

        return combined.stream().map(this::toResponse).toList();
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private UserResponse toResponse(User user) {
        Long activeCount = null;
        if (user.getRole() == Role.TECHNICIAN) {
            activeCount = ticketRepository.countByAssignedToAndStatusIn(user, ACTIVE_STATUSES);
        }

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .active(user.isActive())
                .profileImageUrl(user.getProfileImageUrl())
                .specialization(user.getSpecialization())
                .activeAssignedTicketCount(activeCount)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
