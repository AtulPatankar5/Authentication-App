package com.maverick.auth_app.services.Impl;

import com.maverick.auth_app.dtos.UserDtos;
import com.maverick.auth_app.services.AuthService;
import com.maverick.auth_app.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDtos registerUser(UserDtos userDtos) {

        userDtos.setPassword(passwordEncoder.encode(userDtos.getPassword()));
        return userService.createUser(userDtos);
    }
}
