package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.DashboardSummaryDto;
import com.zoya.riskanalysis.dto.MitigationSuggestionDto;
import com.zoya.riskanalysis.dto.ProjectHealthDto;
import com.zoya.riskanalysis.dto.RiskStatsDto;

public interface DashboardService {

    DashboardSummaryDto getSummary();

    RiskStatsDto getRiskStats();

    ProjectHealthDto getProjectHealth(Long projectId);

    MitigationSuggestionDto getMitigationSuggestion(Long riskId);
}