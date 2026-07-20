package com.zoya.riskanalysis.repository;

import com.zoya.riskanalysis.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}