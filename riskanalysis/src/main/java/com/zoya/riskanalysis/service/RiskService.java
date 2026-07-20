package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.RiskRequestDto;
import com.zoya.riskanalysis.dto.RiskStatusUpdateDto;
import com.zoya.riskanalysis.entity.Risk;

import java.util.List;

public interface RiskService {

    Risk createRisk(RiskRequestDto dto);

    List<Risk> getAllRisks();

    Risk getRiskById(Long id);

    List<Risk> getRisksByProjectId(Long projectId);

    Risk updateRisk(Long id, RiskRequestDto dto);

    Risk updateRiskStatus(Long id, RiskStatusUpdateDto dto);

    void deleteRisk(Long id);
}