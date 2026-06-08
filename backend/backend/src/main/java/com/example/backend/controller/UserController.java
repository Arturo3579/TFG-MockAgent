package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/plan")
    public ResponseEntity<?> getUserPlan(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "plan", user.getPlan().name().toLowerCase()
        ));
    }

    @PostMapping("/plan")
    public ResponseEntity<?> updatePlan(Authentication authentication,
                                        @RequestBody Map<String, String> body) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String newPlan = body.get("plan").toUpperCase();
        user.setPlan(com.example.backend.model.PlanType.valueOf(newPlan));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "plan", user.getPlan().name().toLowerCase()
        ));
    }
}