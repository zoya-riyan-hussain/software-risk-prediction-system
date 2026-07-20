package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;
    private final RiskRepository riskRepository;

    @GetMapping("/mitigation/{riskId}")
    public String generateMitigation(@PathVariable Long riskId) {

        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new RuntimeException("Risk not found"));

        String prompt = String.format("""
You are an AI Software Project Risk Analyst.

Analyze the following project risk and respond with concise bullet points.

Risk Title: %s
Category: %s
Severity: %s
Probability: %d/5
Impact: %d/5

Return ONLY in this format:

Root Cause:
• point 1
• point 2

Mitigation:
• point 1
• point 2
• point 3

Prevention:
• point 1
• point 2

Keep the response under 150 words.
""",
                risk.getTitle(),
                risk.getCategory(),
                risk.getLevel(),
                risk.getProbability(),
                risk.getImpact()
        );

        return aiService.generateMitigation(prompt);
    }
}