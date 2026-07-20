package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.DashboardSummaryDto;
import com.zoya.riskanalysis.dto.MitigationSuggestionDto;
import com.zoya.riskanalysis.dto.ProjectHealthDto;
import com.zoya.riskanalysis.dto.RiskStatsDto;
import com.zoya.riskanalysis.service.DashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDto getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/risk-stats")
    public RiskStatsDto getRiskStats() {
        return dashboardService.getRiskStats();
    }

    @GetMapping("/project-health/{projectId}")
    public ProjectHealthDto getProjectHealth(@PathVariable Long projectId) {
        return dashboardService.getProjectHealth(projectId);
    }

    @GetMapping("/mitigation/{riskId}")
    public MitigationSuggestionDto getMitigationSuggestion(@PathVariable Long riskId) {
        return dashboardService.getMitigationSuggestion(riskId);
    }
}