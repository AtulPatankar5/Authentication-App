package com.maverick.auth_app.services.Impl;

import com.maverick.auth_app.dtos.UserDtos;
import com.maverick.auth_app.entities.User;
import com.maverick.auth_app.exceptions.ResourceNotFoundException;
import com.maverick.auth_app.repositories.UserRepository;
import com.maverick.auth_app.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    @Mock
    private UserRepository userRepo;
    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private ModelMapper modelMapper;

    @Test
    void getUserByEmail() {

        User user = new User();
        user.setEnable(true);
        user.setName("Atul");
        user.setEmail("Atul@gmail.com");
        user.setPassword("112233");

        UserDtos userDto = new UserDtos();
        userDto.setName("Atul");
        userDto.setEmail("Atul@gmail.com");

        // DB mock
        when(userRepo.findByEmail("Atul@gmail.com")).thenReturn(Optional.of(user));

        // ModelMapper mock
        when(modelMapper.map(user, UserDtos.class)).thenReturn(userDto);

        // Execute
        UserDtos actualUser= userService.getUserByEmail("Atul@gmail.com");

        // Assertions
        assertThat(actualUser.getName()).isEqualTo("Atul");
        assertThat(actualUser.getEmail()).isEqualTo("Atul@gmail.com");

        // Verify
        verify(userRepo).findByEmail("Atul@gmail.com");
        verify(modelMapper).map(user, UserDtos.class);

        verify(userRepo, times(1)).findByEmail("Atul@gmail.com");

    }


    @Test
    void shouldThrowExceptionWheUserNotFound() {

      // DB mock
        when(userRepo.findByEmail("Atul@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(()->userService.getUserByEmail("Atul@gmail.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found with given Email Id");
        verify(userRepo, times(1)).findByEmail("Atul@gmail.com");
    }

//    @Test
//    void getAllUsers() {
//    }
}