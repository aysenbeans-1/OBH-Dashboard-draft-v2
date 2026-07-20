package com.obhdashboard.middleware.controller;

import com.obhdashboard.middleware.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider tokenProvider;

    public AuthController(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> generateToken(@RequestBody Map<String, Object> request) {
        String username = (String) request.getOrDefault("username", "admin");
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) request.getOrDefault("roles", List.of("ADMIN"));

        String token = tokenProvider.generateToken(username, roles);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("tokenType", "Bearer");
        return ResponseEntity.ok(response);
    }
}
