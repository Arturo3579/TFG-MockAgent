package com.example.backend.controller;

import com.example.backend.dto.RequestLogDto;
import com.example.backend.service.RequestLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogService requestLogService;

    @GetMapping
    public ResponseEntity<List<RequestLogDto>> getLogs(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(requestLogService.getLogsByUser(email));
    }
}
