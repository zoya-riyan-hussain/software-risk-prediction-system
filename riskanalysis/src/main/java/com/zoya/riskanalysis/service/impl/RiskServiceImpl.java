package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.RiskRequestDto;
import com.zoya.riskanalysis.dto.RiskStatusUpdateDto;
import com.zoya.riskanalysis.entity.Project;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.enums.RiskStatus;
import com.zoya.riskanalysis.repository.ProjectRepository;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.service.RiskService;
import com.zoya.riskanalysis.util.RiskCalculationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskServiceImpl implements RiskService {

    private final RiskRepository riskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public Risk createRisk(RiskRequestDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        int score = RiskCalculationUtil.calculateScore(dto.getProbability(), dto.getImpact());

        Risk risk = Risk.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .probability(dto.getProbability())
                .impact(dto.getImpact())
                .score(score)
                .level(RiskCalculationUtil.calculateLevel(score))
                .status(RiskStatus.OPEN)
                .mitigationPlan(dto.getMitigationPlan())
                .identifiedDate(LocalDate.now())
                .dueDate(dto.getDueDate())
                .project(project)
                .owner(owner)
                .build();

        return riskRepository.save(risk);
    }

    @Override
    public List<Risk> getAllRisks() {
        return riskRepository.findAll();
    }

    @Override
    public Risk getRiskById(Long id) {
        return riskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk not found"));
    }

    @Override
    public List<Risk> getRisksByProjectId(Long projectId) {
        return riskRepository.findByProjectId(projectId);
    }

    @Override
    public Risk updateRisk(Long id, RiskRequestDto dto) {
        Risk existingRisk = riskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk not found"));

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        int score = RiskCalculationUtil.calculateScore(dto.getProbability(), dto.getImpact());

        existingRisk.setTitle(dto.getTitle());
        existingRisk.setDescription(dto.getDescription());
        existingRisk.setCategory(dto.getCategory());
        existingRisk.setProbability(dto.getProbability());
        existingRisk.setImpact(dto.getImpact());
        existingRisk.setScore(score);
        existingRisk.setLevel(RiskCalculationUtil.calculateLevel(score));
        existingRisk.setMitigationPlan(dto.getMitigationPlan());
        existingRisk.setDueDate(dto.getDueDate());
        existingRisk.setProject(project);
        existingRisk.setOwner(owner);

        return riskRepository.save(existingRisk);
    }

    @Override
    public Risk updateRiskStatus(Long id, RiskStatusUpdateDto dto) {
        Risk existingRisk = riskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk not found"));

        existingRisk.setStatus(dto.getStatus());
        return riskRepository.save(existingRisk);
    }

    @Override
    public void deleteRisk(Long id) {
        Risk existingRisk = riskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk not found"));

        riskRepository.delete(existingRisk);
    }
}