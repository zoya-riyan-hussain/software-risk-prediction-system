package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.LoginRequest;
import com.zoya.riskanalysis.dto.LoginResponse;

public interface AuthenticationService {

    LoginResponse login(LoginRequest request);

}