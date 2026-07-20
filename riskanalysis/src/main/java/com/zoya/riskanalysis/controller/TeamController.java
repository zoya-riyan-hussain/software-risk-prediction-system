package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.AssignUserDto;
import com.zoya.riskanalysis.dto.TeamRequestDto;
import com.zoya.riskanalysis.entity.Team;
import com.zoya.riskanalysis.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public Team createTeam(@Valid @RequestBody TeamRequestDto dto) {
        return teamService.createTeam(dto);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/{id}")
    public Team getTeam(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    @PutMapping("/{id}")
    public Team updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody TeamRequestDto dto
    ) {
        return teamService.updateTeam(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteTeam(@PathVariable Long id) {

        teamService.deleteTeam(id);

        return "Team deleted successfully";
    }

    // ==========================
    // Assign User To Team
    // ==========================

    @PostMapping("/assign-user")
    public String assignUser(@RequestBody AssignUserDto dto) {

        teamService.assignUser(dto);

        return "User assigned successfully";
    }

    // ==========================
    // Remove User From Team
    // ==========================

    @DeleteMapping("/remove-user/{userId}")
    public String removeUser(@PathVariable Long userId) {

        teamService.removeUser(userId);

        return "User removed successfully";
    }
}