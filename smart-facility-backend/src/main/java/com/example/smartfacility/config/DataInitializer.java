package com.example.smartfacility.config;

import com.example.smartfacility.enums.Role;
import com.example.smartfacility.model.Category;
import com.example.smartfacility.model.User;
import com.example.smartfacility.repository.CategoryRepository;
import com.example.smartfacility.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name}")
    private String defaultAdminName;

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Electrical", "Plumbing", "IT Support", "Cleaning", "Transport", "General Maintenance"
    );

    @Override
    public void run(String... args) {
        seedCategories();
        seedDefaultAdmin();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            for (String name : DEFAULT_CATEGORIES) {
                Category category = Category.builder()
                        .name(name)
                        .description(name + " related facility issues")
                        .active(true)
                        .build();
                categoryRepository.save(category);
            }
            log.info("Seeded {} default categories", DEFAULT_CATEGORIES.size());
        }
    }

    private void seedDefaultAdmin() {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            User admin = User.builder()
                    .fullName(defaultAdminName)
                    .email(defaultAdminEmail)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin account with email: {}", defaultAdminEmail);
        }
    }
}
