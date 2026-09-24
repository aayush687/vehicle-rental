package com.vehiclerental.controller;

import com.vehiclerental.model.Customer;
import com.vehiclerental.model.LoginRequest;
import com.vehiclerental.model.RegisterRequest;
import com.vehiclerental.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Name is required.");
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email is required.");
        }

        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            return ResponseEntity.badRequest()
                    .body("Password must be at least 6 characters.");
        }

        Customer customer = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword()
        );

        if (customer == null) {
            return ResponseEntity.badRequest()
                    .body("Email is already registered.");
        }

        return ResponseEntity.ok(customer);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        Object user = authService.login(
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password.");
        }

        return ResponseEntity.ok(user);
    }
}