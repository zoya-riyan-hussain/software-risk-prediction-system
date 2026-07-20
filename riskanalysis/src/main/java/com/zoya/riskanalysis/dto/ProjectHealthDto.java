package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.HealthStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectHealthDto {
    private Long projectId;
    private String projectName;
    private long totalRisks;
    private long openRisks;
    private long criticalRisks;
    private int healthScore;
    private HealthStatus healthStatus;
}