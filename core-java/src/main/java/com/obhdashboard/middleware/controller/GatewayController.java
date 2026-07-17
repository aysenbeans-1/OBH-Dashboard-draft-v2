package com.obhdashboard.middleware.controller;

import com.obhdashboard.middleware.dto.TenantRequestDto;
import com.obhdashboard.middleware.dto.UserProfileRequestDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/gateway")
public class GatewayController {

    private final RestTemplate restTemplate;
    private final String backendUrl;

    public GatewayController(@Value("${target.backend.url}") String backendUrl) {
        this.restTemplate = new RestTemplate();
        this.backendUrl = backendUrl;
    }

    @PostMapping("/tenants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTenant(@Valid @RequestBody TenantRequestDto tenantDto) {
        // Forward validated request downstream to the Node/Express backend
        String endpoint = backendUrl + "/api/tenants";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TenantRequestDto> entity = new HttpEntity<>(tenantDto, headers);

        try {
            return restTemplate.exchange(endpoint, HttpMethod.POST, entity, Map.class);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Downstream forward failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(response);
        }
    }

    @PostMapping("/profiles")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createUserProfile(@Valid @RequestBody UserProfileRequestDto profileDto) {
        // Forward validated request downstream to the Node/Express backend
        String endpoint = backendUrl + "/api/user_profiles";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserProfileRequestDto> entity = new HttpEntity<>(profileDto, headers);

        try {
            return restTemplate.exchange(endpoint, HttpMethod.POST, entity, Map.class);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Downstream forward failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(response);
        }
    }
}
