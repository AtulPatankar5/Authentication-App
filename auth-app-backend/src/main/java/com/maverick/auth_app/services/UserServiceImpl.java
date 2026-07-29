package com.maverick.auth_app.services;

import com.maverick.auth_app.dtos.UserDtos;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService{


    @Override
    public UserDtos createUser(UserDtos userDtos) {
        return null;
    }

    @Override
    public UserDtos getUserByEmail(String email) {
        return null;
    }

    @Override
    public UserDtos updateUser(UserDtos userDtos, UUID userId) {
        return null;
    }

    @Override
    public void deleteUser(UUID userId) {

    }

    @Override
    public UserDtos getUserById(UUID userId) {
        return null;
    }

    @Override
    public Iterable<UserDtos> getAllUsers() {
        return null;
    }
}
