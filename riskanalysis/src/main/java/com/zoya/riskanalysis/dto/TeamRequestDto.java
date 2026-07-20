package com.zoya.riskanalysis.dto;

import lombok.Data;

@Data
public class TeamRequestDto {

    private String teamName;

    private String description;

    private Long projectId;
}