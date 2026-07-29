package com.maverick.auth_app.services;

import com.maverick.auth_app.dtos.UserDtos;

import java.util.List;
import java.util.UUID;

public interface UserService {
    //  Create User
    UserDtos createUser(UserDtos userDtos);

    //    Get User
    UserDtos getUserByEmail(String email);

    //    Update User
    UserDtos updateUser(UserDtos userDtos, UUID userId);

    //Delete user
    void deleteUser(UUID userId);

    //    Get User by ID
    UserDtos getUserById(UUID userId);

    //get all user
    Iterable<UserDtos> getAllUsers();
}
