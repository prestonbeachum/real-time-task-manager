package com.taskmanager.server.controller;

import com.taskmanager.server.model.User;
import com.taskmanager.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class UserRegistrationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserRegistrationController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            // Check for existing username
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Username already exists");
            }

            // Check for existing email
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Email already exists");
            }

            // Save new user with encoded password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log error on backend
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }
}
