package com.example.smartfacility.service;

import com.example.smartfacility.dto.request.ChangePasswordRequest;
import com.example.smartfacility.dto.request.CreateUserRequest;
import com.example.smartfacility.dto.request.UpdateUserRequest;
import com.example.smartfacility.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    UserResponse updateUserStatus(Long id, boolean active);

    UserResponse updateUserRole(Long id, com.example.smartfacility.enums.Role role);

    void deleteUser(Long id);

    UserResponse getProfile(String email);

    UserResponse updateProfile(String email, UpdateUserRequest request);

    UserResponse updateProfileImage(String email, String imageUrl);


    void changePassword(String email, ChangePasswordRequest request);

    List<UserResponse> getAvailableTechnicians(com.example.smartfacility.enums.TechnicianSpecialization specialization);
}
