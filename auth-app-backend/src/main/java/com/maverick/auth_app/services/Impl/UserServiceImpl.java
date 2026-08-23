package com.maverick.auth_app.services.Impl;

import com.maverick.auth_app.config.AppConstant;
import com.maverick.auth_app.dtos.UserDtos;
import com.maverick.auth_app.entities.Provider;
import com.maverick.auth_app.entities.Role;
import com.maverick.auth_app.entities.User;
import com.maverick.auth_app.exceptions.ResourceNotFoundException;
import com.maverick.auth_app.helpers.UserHelper;
import com.maverick.auth_app.repositories.RoleRepository;
import com.maverick.auth_app.repositories.UserRepository;
import com.maverick.auth_app.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {


    private final UserRepository userRepo;
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public UserDtos createUser(UserDtos userDtos) {

        if (userDtos.getEmail() == null || userDtos.getEmail().isBlank()) {
            throw new IllegalArgumentException(("Email is not present"));
        }
        if (userRepo.existsByEmail(userDtos.getEmail())) {
            throw new IllegalArgumentException("Email Already present for other user");
        }

        User user = modelMapper.map(userDtos, User.class);

        user.setProvider(userDtos.getProvider() != null ? userDtos.getProvider() : Provider.LOCAL);

        Role role = roleRepository
                .findByName("ROLE_" + AppConstant.GUEST_ROLE)
                .orElseThrow(() -> new ResourceNotFoundException("Guest role not found"));

        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }

        user.getRoles().add(role);
        user.setEnable(true);

        User savedUser = userRepo.save(user);

        return modelMapper.map(savedUser, UserDtos.class);
    }

    @Override
    @Cacheable(value="user", key="#email")
    public UserDtos getUserByEmail(String email) {
        log.info("(CACHE MISS) getting product info from DB for id=>", email);

        User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found with given Email Id"));
        return modelMapper.map(user, UserDtos.class);
    }

    @Override
    @Transactional
    @CacheEvict(value="user", key="#userId")
    public UserDtos updateUser(UserDtos userDtos, String userId) {
        User oldUser = userRepo.findById(UserHelper.parseToUUID(userId)).orElseThrow(() -> new ResourceNotFoundException("User not Found with given ID"));

        if (userDtos.getName() != null && !userDtos.getName().isBlank()) {
            oldUser.setName(userDtos.getName());
        }

        if (userDtos.getImage() != null && !userDtos.getImage().isBlank()) {
            oldUser.setImage(userDtos.getImage());
        }

        if (userDtos.getPassword() != null && !userDtos.getPassword().isBlank()) {
            oldUser.setPassword(userDtos.getPassword());
        }

        if (userDtos.getProvider() != null) {
            oldUser.setProvider(userDtos.getProvider());
        }

        if (userDtos.getEnable() != null) {
            oldUser.setEnable(userDtos.getEnable());
        }

        oldUser.setUpdatedAt(Instant.now());
        User updatedUser = userRepo.save(oldUser);


        return modelMapper.map(updatedUser, UserDtos.class);
    }

    @Transactional
    @Override
    public void deleteUser(String userId) {
        UUID uuid = UserHelper.parseToUUID(userId);
        User user = userRepo.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        userRepo.delete(user);
    }

    @Override
    @Cacheable(value="user", key="#userId")
    public UserDtos getUserById(String userId) {
        UUID uuid = UserHelper.parseToUUID(userId);
        User user = userRepo.findById(uuid).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return modelMapper.map(user, UserDtos.class);
    }

    @Override
    @Cacheable(value="user", key="'allUsers'")
    public Iterable<UserDtos> getAllUsers() {
    log.info("Getting all Users details from DB");
        return userRepo.findAll().
                stream().
                map(user -> modelMapper.map(user, UserDtos.class)).
                toList();

    }
}
