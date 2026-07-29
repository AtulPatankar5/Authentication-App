package com.maverick.auth_app.dtos;

import jakarta.persistence.Column;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleDtos {
    private UUID id;
     private String name;
}
