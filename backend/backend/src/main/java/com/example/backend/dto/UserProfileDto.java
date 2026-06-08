package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private String email;
    private String plan;
    private long endpointCount;
}
