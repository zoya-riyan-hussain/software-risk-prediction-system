package com.zoya.riskanalysis.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zoya.riskanalysis.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "risks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private RiskCategory category;

    private Integer probability;

    private Integer impact;

    private Integer score;

    @Enumerated(EnumType.STRING)
    private RiskLevel level;

    @Enumerated(EnumType.STRING)
    private RiskStatus status;

    @Column(length = 1000)
    private String mitigationPlan;

    private LocalDate identifiedDate;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({
            "teams",
            "risks",
            "hibernateLazyInitializer",
            "handler"
    })
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties({
            "password",
            "hibernateLazyInitializer",
            "handler"
    })
    private User owner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties({
            "project",
            "hibernateLazyInitializer",
            "handler"
    })
    private Team assignedTeam;

}