package com.maverick.auth_app.dtos;

import com.maverick.auth_app.entities.Provider;
import com.maverick.auth_app.entities.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDtos {
    private UUID id;
    private String email;
    private String name;
    private String password;
    private String image;
    private Boolean enable;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private Provider provider = Provider.LOCAL;
    private Set<RoleDtos> roles = new HashSet<>();

}