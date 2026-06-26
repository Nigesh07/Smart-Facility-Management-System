package com.example.smartfacility.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DatabasePatchConfig {

    @Bean
    public CommandLineRunner patchDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE tickets ALTER COLUMN created_by DROP NOT NULL;");
                log.info("Successfully dropped NOT NULL constraint on tickets.created_by");
            } catch (Exception e) {
                log.warn("Could not alter tickets.created_by, it may already be nullable or table doesn't exist");
            }

            try {
                jdbcTemplate.execute("ALTER TABLE ticket_history ALTER COLUMN updated_by DROP NOT NULL;");
                log.info("Successfully dropped NOT NULL constraint on ticket_history.updated_by");
            } catch (Exception e) {
                log.warn("Could not alter ticket_history.updated_by, it may already be nullable or table doesn't exist");
            }
        };
    }
}
