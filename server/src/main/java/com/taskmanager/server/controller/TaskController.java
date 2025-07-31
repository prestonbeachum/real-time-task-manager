package com.taskmanager.server.controller;

import com.taskmanager.server.model.Task;
import com.taskmanager.server.model.User;
import com.taskmanager.server.service.TaskService;
import com.taskmanager.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<Task> tasks = taskService.getTasksByUsername(username);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createTask(
            @RequestBody Task task,
            Authentication authentication
    ) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            task.setUser(user);
            Task savedTask = taskService.saveTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, Authentication authentication) {
        try {
            String username = authentication.getName();
            Task existingTask = taskService.getTaskById(id);

            if (existingTask == null) {
                return ResponseEntity.notFound().build();
            }

            if (!existingTask.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }

            task.setId(id);
            task.setUser(user);
            Task updatedTask = taskService.saveTask(task);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Task existingTask = taskService.getTaskById(id);

            if (existingTask == null) {
                return ResponseEntity.notFound().build();
            }

            if (!existingTask.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            taskService.deleteTask(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete task: " + e.getMessage());
        }
    }
}
