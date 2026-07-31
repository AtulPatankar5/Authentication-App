package com.maverick.auth_app.services;

import com.maverick.auth_app.dtos.UserDtos;

public interface AuthService {

    UserDtos registerUser(UserDtos userDtos);
}
