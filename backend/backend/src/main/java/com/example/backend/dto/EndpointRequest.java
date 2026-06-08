package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EndpointRequest {
    @NotBlank
    private String path;

    @NotBlank
    private String method;

    @NotNull
    private Integer status;

    private String responseBody;
}