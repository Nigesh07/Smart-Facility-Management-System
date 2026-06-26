package com.example.smartfacility.service;

import com.example.smartfacility.dto.request.LoginRequest;
import com.example.smartfacility.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
