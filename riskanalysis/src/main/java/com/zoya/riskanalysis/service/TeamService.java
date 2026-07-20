package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.TeamRequestDto;
import com.zoya.riskanalysis.entity.Team;
import com.zoya.riskanalysis.dto.AssignUserDto;

import java.util.List;

public interface TeamService {

    Team createTeam(TeamRequestDto dto);

    List<Team> getAllTeams();

    Team getTeamById(Long id);

    Team updateTeam(Long id, TeamRequestDto dto);

    void deleteTeam(Long id);
    void assignUser(AssignUserDto dto);

    void removeUser(Long userId);
}