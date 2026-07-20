package com.zoya.riskanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDto {

    private long totalProjects;
    private long totalRisks;
    private long totalUsers;
    private long openRisks;
    private long criticalRisks;
}