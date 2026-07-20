package com.zoya.riskanalysis.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teamName;

    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({
            "teams",
            "manager",
            "hibernateLazyInitializer",
            "handler"
    })
    private Project project;

    @OneToMany(mappedBy = "team")
    @JsonIgnoreProperties({
            "team",
            "password"
    })
    @Builder.Default
    private List<User> members = new ArrayList<>();
}