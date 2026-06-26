package com.example.smartfacility.controller;

import com.example.smartfacility.dto.response.ApiResponse;
import com.example.smartfacility.dto.response.UploadResponse;
import com.example.smartfacility.service.CloudinaryService;
import com.example.smartfacility.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final UserService userService;

    @PostMapping(value = "/ticket-issue", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadTicketIssueImage(@RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadImage(file, "smart-facility/ticket-issues");
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", new UploadResponse(url)));
    }

    @PostMapping(value = "/ticket-completion", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadTicketCompletionImage(@RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadImage(file, "smart-facility/ticket-completions");
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", new UploadResponse(url)));
    }

    @PostMapping(value = "/profile-image", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                                            Authentication authentication) {
        String url = cloudinaryService.uploadImage(file, "smart-facility/profile-images");
        userService.updateProfileImage(authentication.getName(), url);
        return ResponseEntity.ok(ApiResponse.success("Profile image updated successfully", new UploadResponse(url)));
    }
}
