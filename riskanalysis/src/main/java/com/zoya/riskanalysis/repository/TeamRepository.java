package com.zoya.riskanalysis.repository;

import com.zoya.riskanalysis.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}