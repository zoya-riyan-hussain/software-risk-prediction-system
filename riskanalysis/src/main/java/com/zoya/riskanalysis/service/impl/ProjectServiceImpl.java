package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.ProjectRequestDto;
import com.zoya.riskanalysis.entity.Project;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.entity.Team;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.repository.ProjectRepository;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.repository.TeamRepository;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final RiskRepository riskRepository;
    private final TeamRepository teamRepository;

    @Override
    public Project createProject(ProjectRequestDto dto) {

        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .budget(dto.getBudget())
                .status(dto.getStatus())
                .manager(manager)
                .build();

        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public Project updateProject(Long id, ProjectRequestDto dto) {

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        existingProject.setName(dto.getName());
        existingProject.setDescription(dto.getDescription());
        existingProject.setStartDate(dto.getStartDate());
        existingProject.setEndDate(dto.getEndDate());
        existingProject.setBudget(dto.getBudget());
        existingProject.setStatus(dto.getStatus());
        existingProject.setManager(manager);

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Delete all risks belonging to this project
        List<Risk> risks = riskRepository.findByProjectId(id);
        riskRepository.deleteAll(risks);

        // Remove users from teams and delete teams
        List<Team> teams = teamRepository.findAll();

        for (Team team : teams) {

            if (team.getProject() != null &&
                    team.getProject().getId().equals(id)) {

                List<User> users = userRepository.findByTeamId(team.getId());

                for (User user : users) {
                    user.setTeam(null);
                }

                userRepository.saveAll(users);

                teamRepository.delete(team);
            }
        }

        projectRepository.delete(project);
    }
}