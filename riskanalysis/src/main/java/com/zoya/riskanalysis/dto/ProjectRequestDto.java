package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequestDto {

    @NotBlank(message = "Project name is required")
    private String name;

    @NotBlank(message = "Project description is required")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Budget is required")
    private Double budget;

    @NotNull(message = "Project status is required")
    private ProjectStatus status;

    @NotNull(message = "Manager ID is required")
    private Long managerId;
}