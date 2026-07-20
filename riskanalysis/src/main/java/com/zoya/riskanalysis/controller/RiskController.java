package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.RiskRequestDto;
import com.zoya.riskanalysis.dto.RiskStatusUpdateDto;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.service.RiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/risks")
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @PostMapping
    public Risk createRisk(@Valid @RequestBody RiskRequestDto dto) {
        return riskService.createRisk(dto);
    }

    @GetMapping
    public List<Risk> getAllRisks() {
        return riskService.getAllRisks();
    }

    @GetMapping("/{id}")
    public Risk getRiskById(@PathVariable Long id) {
        return riskService.getRiskById(id);
    }

    @GetMapping("/project/{projectId}")
    public List<Risk> getRisksByProjectId(@PathVariable Long projectId) {
        return riskService.getRisksByProjectId(projectId);
    }

    @PutMapping("/{id}")
    public Risk updateRisk(@PathVariable Long id, @Valid @RequestBody RiskRequestDto dto) {
        return riskService.updateRisk(id, dto);
    }

    @PatchMapping("/{id}/status")
    public Risk updateRiskStatus(@PathVariable Long id, @RequestBody RiskStatusUpdateDto dto) {
        return riskService.updateRiskStatus(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteRisk(@PathVariable Long id) {
        riskService.deleteRisk(id);
        return "Risk deleted successfully";
    }
}