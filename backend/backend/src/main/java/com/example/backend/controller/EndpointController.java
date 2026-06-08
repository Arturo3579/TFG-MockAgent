package com.example.backend.controller;

import com.example.backend.dto.EndpointDto;
import com.example.backend.dto.EndpointRequest;
import com.example.backend.service.EndpointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/endpoints")
@RequiredArgsConstructor
public class EndpointController {

    private final EndpointService endpointService;

    @GetMapping
    public ResponseEntity<List<EndpointDto>> getEndpoints(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(endpointService.getEndpointsByUser(email));
    }

    @PostMapping
    public ResponseEntity<EndpointDto> createEndpoint(Authentication authentication,
                                                      @Valid @RequestBody EndpointRequest request) {
        String email = authentication.getName();
        EndpointDto created = endpointService.createEndpoint(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EndpointDto> updateEndpoint(Authentication authentication,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody EndpointRequest request) {
        String email = authentication.getName();
        EndpointDto updated = endpointService.updateEndpoint(email, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEndpoint(Authentication authentication,
                                                                @PathVariable Long id) {
        String email = authentication.getName();
        endpointService.deleteEndpoint(email, id);
        return ResponseEntity.ok(Map.of("message", "Endpoint eliminado"));
    }
}