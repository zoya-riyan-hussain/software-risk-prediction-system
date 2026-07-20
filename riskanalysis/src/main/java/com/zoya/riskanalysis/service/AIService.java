package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.OllamaRequest;
import com.zoya.riskanalysis.dto.OllamaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AIService {

    private final RestTemplate restTemplate;

    private static final String URL =
            "http://localhost:11434/api/generate";

    public String generateMitigation(String prompt) {

        OllamaRequest request =
                new OllamaRequest(
                        "llama3.2:3b",
                        prompt,
                        false
                );
        OllamaResponse response =
                restTemplate.postForObject(
                        URL,
                        request,
                        OllamaResponse.class
                );

        return response.getResponse();
    }
}