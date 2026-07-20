package com.zoya.riskanalysis.dto;

import com.zoya.riskanalysis.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Long id;
    private String name;
    private String email;
    private UserRole role;

}