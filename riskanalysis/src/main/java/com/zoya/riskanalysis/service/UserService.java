package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.UserRequestDto;
import com.zoya.riskanalysis.entity.User;

import java.util.List;

public interface UserService {
    User createUser(UserRequestDto dto);
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, UserRequestDto dto);
    void deleteUser(Long id);
}