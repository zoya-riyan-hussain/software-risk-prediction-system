package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.LoginRequest;
import com.zoya.riskanalysis.dto.LoginResponse;
import com.zoya.riskanalysis.entity.User;
import com.zoya.riskanalysis.repository.UserRepository;
import com.zoya.riskanalysis.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        System.out.println("Email entered : " + request.getEmail());
        System.out.println("Password entered : " + request.getPassword());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("❌ USER NOT FOUND");
                    return new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED,
                            "Invalid Email or Password"
                    );
                });

        System.out.println("✅ USER FOUND");
        System.out.println("DB Email : " + user.getEmail());
        System.out.println("Stored Hash : " + user.getPassword());

        boolean matches = encoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        System.out.println("Password Match : " + matches);

        if (!matches) {
            System.out.println("❌ PASSWORD DOES NOT MATCH");
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid Email or Password"
            );
        }

        System.out.println("✅ LOGIN SUCCESS");

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