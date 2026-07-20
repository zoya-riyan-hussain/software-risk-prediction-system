package com.zoya.riskanalysis.service.impl;

import com.zoya.riskanalysis.dto.UserRequestDto;
import com.zoya.riskanalysis.entity.Project;
import com.zoya.riskanalysis.entity.Risk;
import com.zoya.riskanalysis.entity.Team;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.repository.ProjectRepository;
import com.zoya.riskanalysis.repository.RiskRepository;
import com.zoya.riskanalysis.repository.TeamRepository;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final RiskRepository riskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(UserRequestDto dto) {

        // Password mandatory while creating
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        Team team = null;

        if (dto.getTeamId() != null) {
            team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .team(team)
                .build();

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateUser(Long id, UserRequestDto dto) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(dto.getName());
        existingUser.setEmail(dto.getEmail());
        existingUser.setRole(dto.getRole());

        if (dto.getTeamId() != null) {
            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));

            existingUser.setTeam(team);
        } else {
            existingUser.setTeam(null);
        }

        // Update password ONLY if provided
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove as Project Manager
        List<Project> projects = projectRepository.findAll();

        for (Project project : projects) {
            if (project.getManager() != null &&
                    project.getManager().getId().equals(id)) {

                project.setManager(null);
            }
        }

        projectRepository.saveAll(projects);

        // Remove as Risk Owner
        List<Risk> risks = riskRepository.findAll();

        for (Risk risk : risks) {
            if (risk.getOwner() != null &&
                    risk.getOwner().getId().equals(id)) {

                risk.setOwner(null);
            }
        }

        riskRepository.saveAll(risks);

        // Remove Team Assignment
        user.setTeam(null);
        userRepository.save(user);

        userRepository.delete(user);
    }
}