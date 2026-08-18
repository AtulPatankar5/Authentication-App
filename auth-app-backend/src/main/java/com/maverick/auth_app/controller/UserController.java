package com.maverick.auth_app.controller;

import com.maverick.auth_app.config.AppConstant;
import com.maverick.auth_app.dtos.UserDtos;
import com.maverick.auth_app.services.Impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("/create-user")
    public ResponseEntity<UserDtos> createUser(@RequestBody UserDtos userDtos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDtos));
    }

    @GetMapping("/get-allUsers")
    public ResponseEntity<Iterable<UserDtos>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/get-user/email")
    public ResponseEntity<UserDtos> getUserByEmail(@RequestParam String emailId) {
        return ResponseEntity.ok(userService.getUserByEmail(emailId));
    }

    @PreAuthorize("hasRole('"+ AppConstant.ADMIN_ROLE+"')")
    @GetMapping("/get-user")
    public ResponseEntity<UserDtos> getUserByUserId(@RequestParam String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestParam String userId) {
        userService.deleteUser(userId);

        Map<String, String> map = new HashMap<>();
        map.put("message", "User Deleted SuccessFully");
        map.put("status", String.valueOf(HttpStatus.OK.value()));
        return ResponseEntity.ok(map);
    }
    @PutMapping("/update-user")
    public ResponseEntity<UserDtos> UpdateUser(@RequestBody UserDtos userDtos, @RequestParam String userId) {
        UserDtos dtos = userService.updateUser(userDtos, userId);
        return ResponseEntity.ok(dtos);
    }




}
