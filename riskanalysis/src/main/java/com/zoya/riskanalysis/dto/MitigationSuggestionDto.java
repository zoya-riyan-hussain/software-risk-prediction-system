package com.zoya.riskanalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MitigationSuggestionDto {
    private String riskCategory;
    private String riskLevel;
    private String suggestion;
}