package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.AssignUserDto;
import com.zoya.riskanalysis.dto.TeamRequestDto;
import com.zoya.riskanalysis.entity.Project;
import com.zoya.riskanalysis.entity.Team;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.repository.ProjectRepository;
import com.zoya.riskanalysis.repository.TeamRepository;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public Team createTeam(TeamRequestDto dto) {

        Project project = null;

        if (dto.getProjectId() != null) {
            project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
        }

        Team team = Team.builder()
                .teamName(dto.getTeamName())
                .description(dto.getDescription())
                .project(project)
                .build();

        return teamRepository.save(team);
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Override
    public Team updateTeam(Long id, TeamRequestDto dto) {

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setTeamName(dto.getTeamName());
        team.setDescription(dto.getDescription());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            team.setProject(project);
        }

        return teamRepository.save(team);
    }

    @Override
    public void deleteTeam(Long id) {

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        List<User> users = userRepository.findByTeamId(id);

        for (User user : users) {
            user.setTeam(null);
        }

        userRepository.saveAll(users);

        teamRepository.delete(team);
    }

    @Override
    public void assignUser(AssignUserDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        user.setTeam(team);

        userRepository.save(user);
    }

    @Override
    public void removeUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTeam(null);

        userRepository.save(user);
    }
}