package com.zoya.riskanalysis.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("Admin: " + encoder.encode("V@zoya1234"));
        System.out.println("Steve Harrington: " + encoder.encode("Steve@123"));
        System.out.println("Ayesha: " + encoder.encode("Ayesha@123"));
        System.out.println("Nancy Wheeler: " + encoder.encode("Nancy@123"));
        System.out.println("Mike Wheeler: " + encoder.encode("Mike@123"));
    }
}