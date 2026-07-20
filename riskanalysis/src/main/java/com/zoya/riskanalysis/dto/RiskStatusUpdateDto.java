package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.RiskStatus;
import lombok.Data;

@Data
public class RiskStatusUpdateDto {
    private RiskStatus status;
}