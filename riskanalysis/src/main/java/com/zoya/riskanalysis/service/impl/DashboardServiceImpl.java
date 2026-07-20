package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.DashboardSummaryDto;
import com.zoya.riskanalysis.dto.MitigationSuggestionDto;
import com.zoya.riskanalysis.dto.ProjectHealthDto;
import com.zoya.riskanalysis.dto.RiskStatsDto;
import com.zoya.riskanalysis.entity.Project;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.enums.HealthStatus;
import com.zoya.riskanalysis.enums.RiskCategory;
import com.zoya.riskanalysis.enums.RiskLevel;
import com.zoya.riskanalysis.enums.RiskStatus;
import com.zoya.riskanalysis.repository.ProjectRepository;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final RiskRepository riskRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardSummaryDto getSummary() {

        DashboardSummaryDto dto = new DashboardSummaryDto();

        dto.setTotalProjects(projectRepository.count());
        dto.setTotalRisks(riskRepository.count());
        dto.setTotalUsers(userRepository.count());
        dto.setOpenRisks(riskRepository.countByStatus(RiskStatus.OPEN));
        dto.setCriticalRisks(riskRepository.countByLevel(RiskLevel.CRITICAL));

        return dto;
    }

    @Override
    public RiskStatsDto getRiskStats() {

        long low = riskRepository.countByLevel(RiskLevel.LOW);
        long medium = riskRepository.countByLevel(RiskLevel.MEDIUM);
        long high = riskRepository.countByLevel(RiskLevel.HIGH);
        long critical = riskRepository.countByLevel(RiskLevel.CRITICAL);

        return new RiskStatsDto(low, medium, high, critical);
    }

    @Override
    public ProjectHealthDto getProjectHealth(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        long totalRisks = riskRepository.countByProjectId(projectId);
        long openRisks = riskRepository.countByProjectIdAndStatus(projectId, RiskStatus.OPEN);
        long criticalRisks = riskRepository.countByProjectIdAndLevel(projectId, RiskLevel.CRITICAL);

        int healthScore = 100;
        healthScore -= (int) (totalRisks * 10);
        healthScore -= (int) (openRisks * 15);
        healthScore -= (int) (criticalRisks * 20);

        if (healthScore < 0) {
            healthScore = 0;
        }

        HealthStatus healthStatus;

        if (healthScore >= 85) {
            healthStatus = HealthStatus.HEALTHY;
        } else if (healthScore >= 70) {
            healthStatus = HealthStatus.WARNING;
        } else if (healthScore >= 50) {
            healthStatus = HealthStatus.AT_RISK;
        } else {
            healthStatus = HealthStatus.CRITICAL;
        }

        return new ProjectHealthDto(
                project.getId(),
                project.getName(),
                totalRisks,
                openRisks,
                criticalRisks,
                healthScore,
                healthStatus
        );
    }

    @Override
    public MitigationSuggestionDto getMitigationSuggestion(Long riskId) {

        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new RuntimeException("Risk not found"));

        String suggestion = generateSuggestion(
                risk.getCategory(),
                risk.getLevel()
        );

        return new MitigationSuggestionDto(
                risk.getCategory().name(),
                risk.getLevel().name(),
                suggestion
        );
    }

    private String generateSuggestion(RiskCategory category, RiskLevel level) {

        if (category == RiskCategory.SCHEDULE) {
            if (level == RiskLevel.CRITICAL || level == RiskLevel.HIGH) {
                return "Reallocate resources, break tasks into smaller milestones, and add timeline buffer.";
            }
            return "Review sprint plan and monitor task deadlines closely.";
        }

        if (category == RiskCategory.RESOURCE) {
            if (level == RiskLevel.CRITICAL || level == RiskLevel.HIGH) {
                return "Assign backup team members, rebalance workload, and hire or allocate additional resources.";
            }
            return "Track team utilization and prevent resource overload.";
        }

        if (category == RiskCategory.TECHNICAL) {
            if (level == RiskLevel.CRITICAL || level == RiskLevel.HIGH) {
                return "Create proof of concept, involve senior developers, and increase testing coverage.";
            }
            return "Conduct technical review and monitor integration risks.";
        }

        if (category == RiskCategory.REQUIREMENT) {
            return "Freeze scope, document requirement changes, and enforce approval workflow.";
        }

        if (category == RiskCategory.QUALITY) {
            return "Increase code reviews, improve testing, and track defect trends regularly.";
        }

        if (category == RiskCategory.SECURITY) {
            return "Perform security audit, review access control, and patch vulnerabilities immediately.";
        }

        if (category == RiskCategory.COMMUNICATION) {
            return "Schedule regular status meetings and improve stakeholder communication channels.";
        }

        if (category == RiskCategory.BUDGET) {
            return "Review budget allocation, reduce unnecessary costs, and track spending weekly.";
        }

        return "Monitor the risk closely and assign clear mitigation ownership.";
    }
}