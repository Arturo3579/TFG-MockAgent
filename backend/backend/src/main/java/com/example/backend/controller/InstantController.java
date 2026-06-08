package com.example.backend.controller;

import com.example.backend.dto.InstantRequest;
import com.example.backend.dto.InstantResponse;
import com.example.backend.service.InstantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/instant")
@RequiredArgsConstructor
public class InstantController {

    private final InstantService instantService;

    @PostMapping("/create")
    public ResponseEntity<InstantResponse> createInstant(@RequestBody InstantRequest request) {
        InstantResponse instant = instantService.createInstant(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(instant);
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<Boolean> checkInstant(@PathVariable Long id) {
        boolean exists = instantService.instantExists(id);
        return ResponseEntity.ok(exists);
    }
}
