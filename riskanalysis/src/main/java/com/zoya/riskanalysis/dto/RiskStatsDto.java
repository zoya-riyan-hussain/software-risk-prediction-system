package com.zoya.riskanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RiskStatsDto {
    private long low;
    private long medium;
    private long high;
    private long critical;
}