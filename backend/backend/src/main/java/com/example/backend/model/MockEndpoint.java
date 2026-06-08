package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_endpoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockEndpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    @Builder.Default
    private Integer status = 200;

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String responseBody = "{}";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDemo = false;

    @Column(nullable = false)
    @Builder.Default
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}