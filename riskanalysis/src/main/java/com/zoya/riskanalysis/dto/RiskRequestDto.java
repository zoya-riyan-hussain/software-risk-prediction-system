package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.RiskCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RiskRequestDto {

    @NotBlank(message = "Risk title is required")
    private String title;

    @NotBlank(message = "Risk description is required")
    private String description;

    @NotNull(message = "Risk category is required")
    private RiskCategory category;

    @NotNull(message = "Probability is required")
    @Min(value = 1, message = "Probability must be at least 1")
    @Max(value = 5, message = "Probability must be at most 5")
    private Integer probability;

    @NotNull(message = "Impact is required")
    @Min(value = 1, message = "Impact must be at least 1")
    @Max(value = 5, message = "Impact must be at most 5")
    private Integer impact;

    @NotBlank(message = "Mitigation plan is required")
    private String mitigationPlan;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;
}