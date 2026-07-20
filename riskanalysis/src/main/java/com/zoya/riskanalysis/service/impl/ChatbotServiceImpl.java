package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.ChatResponseDto;
import com.zoya.riskanalysis.dto.DashboardSummaryDto;
import com.zoya.riskanalysis.dto.MitigationSuggestionDto;
import com.zoya.riskanalysis.dto.ProjectHealthDto;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.enums.RiskLevel;
import com.zoya.riskanalysis.enums.RiskStatus;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.service.ChatbotService;
import com.zoya.riskanalysis.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private final RiskRepository riskRepository;
    private final DashboardService dashboardService;

    @Override
    public ChatResponseDto askQuestion(String message) {

        String lowerMessage = message.toLowerCase().trim();

        if (lowerMessage.contains("all risks")) {
            List<Risk> risks = riskRepository.findAll();

            if (risks.isEmpty()) {
                return new ChatResponseDto("There are no risks in the system.");
            }

            StringBuilder reply = new StringBuilder("Here are the risks: ");
            for (Risk risk : risks) {
                reply.append("[")
                        .append(risk.getId())
                        .append(" - ")
                        .append(risk.getTitle())
                        .append(" - ")
                        .append(risk.getLevel())
                        .append("], ");
            }

            return new ChatResponseDto(reply.toString());
        }

        if (lowerMessage.contains("critical risks")) {
            List<Risk> criticalRisks = riskRepository.findByLevel(RiskLevel.CRITICAL);

            if (criticalRisks.isEmpty()) {
                return new ChatResponseDto("There are no critical risks.");
            }

            StringBuilder reply = new StringBuilder("Critical risks are: ");
            for (Risk risk : criticalRisks) {
                reply.append("[")
                        .append(risk.getId())
                        .append(" - ")
                        .append(risk.getTitle())
                        .append("], ");
            }

            return new ChatResponseDto(reply.toString());
        }

        if (lowerMessage.contains("open risks")) {
            List<Risk> openRisks = riskRepository.findByStatus(RiskStatus.OPEN);

            if (openRisks.isEmpty()) {
                return new ChatResponseDto("There are no open risks.");
            }

            StringBuilder reply = new StringBuilder("Open risks are: ");
            for (Risk risk : openRisks) {
                reply.append("[")
                        .append(risk.getId())
                        .append(" - ")
                        .append(risk.getTitle())
                        .append("], ");
            }

            return new ChatResponseDto(reply.toString());
        }

        if (lowerMessage.contains("dashboard summary") || lowerMessage.contains("summary")) {
            DashboardSummaryDto summary = dashboardService.getSummary();

            String reply = "Dashboard Summary -> Total Projects: " + summary.getTotalProjects()
                    + ", Total Risks: " + summary.getTotalRisks()
                    + ", Open Risks: " + summary.getOpenRisks()
                    + ", Critical Risks: " + summary.getCriticalRisks();

            return new ChatResponseDto(reply);
        }

        if (lowerMessage.contains("project health")) {
            Long projectId = extractId(lowerMessage);

            if (projectId == null) {
                return new ChatResponseDto("Please mention a valid project ID. Example: project health 2");
            }

            try {
                ProjectHealthDto health = dashboardService.getProjectHealth(projectId);

                String reply = "Project Health -> Project: " + health.getProjectName()
                        + ", Score: " + health.getHealthScore()
                        + ", Status: " + health.getHealthStatus();

                return new ChatResponseDto(reply);
            } catch (RuntimeException ex) {
                return new ChatResponseDto(ex.getMessage());
            }
        }

        if (lowerMessage.contains("mitigation")) {
            Long riskId = extractId(lowerMessage);

            if (riskId == null) {
                return new ChatResponseDto("Please mention a valid risk ID. Example: mitigation 2");
            }

            try {
                MitigationSuggestionDto suggestion = dashboardService.getMitigationSuggestion(riskId);

                String reply = "Mitigation Suggestion -> Category: " + suggestion.getRiskCategory()
                        + ", Level: " + suggestion.getRiskLevel()
                        + ", Suggestion: " + suggestion.getSuggestion();

                return new ChatResponseDto(reply);
            } catch (RuntimeException ex) {
                return new ChatResponseDto(ex.getMessage());
            }
        }

        return new ChatResponseDto(
                "I can help with: all risks, critical risks, open risks, dashboard summary, project health <id>, mitigation <riskId>."
        );
    }

    private Long extractId(String message) {
        String[] parts = message.split(" ");
        for (String part : parts) {
            try {
                return Long.parseLong(part);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }
}