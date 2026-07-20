package com.zoya.riskanalysis.repository;

import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.enums.RiskLevel;
import com.zoya.riskanalysis.enums.RiskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiskRepository extends JpaRepository<Risk, Long> {

    List<Risk> findByLevel(RiskLevel level);

    List<Risk> findByStatus(RiskStatus status);

    List<Risk> findByProjectId(Long projectId);

    List<Risk> findByOwnerId(Long ownerId);

    long countByStatus(RiskStatus status);

    long countByLevel(RiskLevel level);

    long countByProjectId(Long projectId);

    long countByProjectIdAndStatus(Long projectId, RiskStatus status);

    long countByProjectIdAndLevel(Long projectId, RiskLevel level);
}