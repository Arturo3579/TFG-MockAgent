package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InstantResponse {
    private Long id;
    private String path;
    private String url;
    private String curlExample;
    private String message;
}
