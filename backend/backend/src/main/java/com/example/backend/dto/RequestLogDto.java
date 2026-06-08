package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RequestLogDto {
    private Long id;
    private LocalDateTime timestamp;
    private String method;
    private String path;
    private Integer statusCode;
    private Long endpointId;
}
