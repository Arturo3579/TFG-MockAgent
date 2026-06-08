package com.example.backend.service;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.UserProfileDto;
import com.example.backend.exception.InvalidCredentialsException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.PlanType;
import com.example.backend.model.User;
import com.example.backend.repository.MockEndpointRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.util.EmailValidator;
import com.example.backend.util.PasswordValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MockEndpointRepository endpointRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(AuthRequest request) {
        if (!EmailValidator.isValid(request.getEmail())) {
            throw new RuntimeException("Email inválido o de dominio temporal. Usa un email real como Gmail, Outlook o corporativo.");
        }
        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new RuntimeException(PasswordValidator.getRequirements());
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .plan(PlanType.STARTER)
                    .build();
        } else {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPlan(PlanType.STARTER);
        }

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getPlan().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .plan(user.getPlan().name().toLowerCase())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales no válidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciales no válidas");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getPlan().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .plan(user.getPlan().name().toLowerCase())
                .build();
    }

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        long count = endpointRepository.countByUser(user);

        return UserProfileDto.builder()
                .email(user.getEmail())
                .plan(user.getPlan().name().toLowerCase())
                .endpointCount(count)
                .build();
    }

    public UserProfileDto upgradePlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        user.setPlan(PlanType.PRO);
        user = userRepository.save(user);

        return getProfile(user.getEmail());
    }
}