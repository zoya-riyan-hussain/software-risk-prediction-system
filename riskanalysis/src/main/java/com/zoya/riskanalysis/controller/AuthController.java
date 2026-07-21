package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.LoginRequest;
import com.zoya.riskanalysis.dto.LoginResponse;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        System.out.println("========== LOGIN REQUEST ==========");
        System.out.println("Email entered: " + request.getEmail());
        System.out.println("Password entered: " + request.getPassword());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        System.out.println("User found in DB: " + user.getEmail());
        System.out.println("Stored Hash: " + user.getPassword());

        boolean matches = encoder.matches(request.getPassword(), user.getPassword());

        System.out.println("Password Match = " + matches);

        if (!matches) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}