package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Email format is invalid")
    @NotBlank(message = "Email is required")
    private String email;

    // Optional during update
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;

    private Long teamId;
}