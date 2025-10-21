package com.taskmanager.server.controller;

import com.taskmanager.server.model.User;
import com.taskmanager.server.model.Task;
import com.taskmanager.server.service.UserService;
import com.taskmanager.server.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        try {
            List<User> users = userService.getAllUsers();
            // Return simplified user data without passwords
            List<Map<String, String>> userData = users.stream()
                .map(user -> Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch users");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q, Authentication authentication) {
        try {
            List<User> allUsers = userService.getAllUsers();
            String query = q.toLowerCase();
            
            List<Map<String, String>> filteredUsers = allUsers.stream()
                .filter(user -> 
                    user.getUsername().toLowerCase().contains(query) ||
                    user.getEmail().toLowerCase().contains(query)
                )
                .map(user -> Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
                ))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(filteredUsers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Search failed");
        }
    }
}
