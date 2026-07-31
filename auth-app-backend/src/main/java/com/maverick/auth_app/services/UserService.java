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
    UserDtos updateUser(UserDtos userDtos, String userId);

    //Delete user
    void deleteUser(String userId);

    //    Get User by ID
    UserDtos getUserById(String userId);

    //get all user
    Iterable<UserDtos> getAllUsers();
}
