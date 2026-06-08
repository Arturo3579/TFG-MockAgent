package com.example.backend.service;

import com.example.backend.dto.InstantResponse;
import com.example.backend.model.MockEndpoint;
import com.example.backend.repository.MockEndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InstantService {

    private final MockEndpointRepository endpointRepository;

    private static final String INSTANT_RESPONSE = "{\"message\": \"Hello from MockAgent!\", \"status\": \"instant\", \"timestamp\": \"\"}";

    @Transactional
    public InstantResponse createInstant(String name) {
        String sanitizedName = name != null ? name.replaceAll("[^a-zA-Z0-9-]", "").toLowerCase() : "instant";
        if (sanitizedName.isEmpty()) sanitizedName = "instant";
        
        String uniquePath = "/instant/" + sanitizedName + "-" + UUID.randomUUID().toString().substring(0, 8);

        MockEndpoint endpoint = MockEndpoint.builder()
                .path(uniquePath)
                .method("GET")
                .status(200)
                .responseBody(INSTANT_RESPONSE)
                .isDemo(true)
                .createdAt(LocalDateTime.now())
                .build();

        endpoint = endpointRepository.save(endpoint);

        String url = "http://localhost:9090/mock" + uniquePath;
        String curlExample = "curl " + url;

        return InstantResponse.builder()
                .id(endpoint.getId())
                .path(uniquePath)
                .url(url)
                .curlExample(curlExample)
                .message("Instant endpoint created! It will expire in 24 hours.")
                .build();
    }

    public boolean instantExists(Long id) {
        return endpointRepository.findById(id)
                .map(e -> e.getIsDemo() && e.getCreatedAt().isAfter(LocalDateTime.now().minusHours(24)))
                .orElse(false);
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void cleanupOldInstants() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        endpointRepository.deleteByIsDemoTrueAndCreatedAtBefore(cutoff);
    }
}
