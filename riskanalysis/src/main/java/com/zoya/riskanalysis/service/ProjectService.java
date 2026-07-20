package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.ProjectRequestDto;
import com.zoya.riskanalysis.entity.Project;

import java.util.List;

public interface ProjectService {
    Project createProject(ProjectRequestDto dto);
    List<Project> getAllProjects();
    Project getProjectById(Long id);
    Project updateProject(Long id, ProjectRequestDto dto);
    void deleteProject(Long id);
}