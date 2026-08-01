package com.maverick.auth_app.security;

import com.maverick.auth_app.entities.Role;
import com.maverick.auth_app.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Getter
@Setter
public class JwtService {

    private final SecretKey key;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-ttl-seconds}") long accessTtlSeconds,
            @Value("${security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
            @Value("${security.jwt.issuer}") String issuer
    ) {
        if (secret == null || secret.length() < 64)
            throw new IllegalArgumentException("invalid Secret");

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;
    }


    //Generate Access Token code write
    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        List<String> roles = user.getRoles() == null ? List.of() :
                user.getRoles().stream().map(Role::getName).toList();

        return Jwts.builder().
                id(UUID.randomUUID().toString()).
                subject(user.getId().toString()).
                issuer(issuer).
                issuedAt(Date.from(now)).
                expiration((Date.from(now.plusSeconds(accessTtlSeconds)))).
                claims(Map.of(
                        "email", user.getEmail(),
                        "roles", roles,
                        "typ", "access"
                )).
                signWith(key, Jwts.SIG.HS512).compact();
    }

    //Generate Refresh Token code write
    public String generateRefreshToken(User user, String jti) {
        Instant now = Instant.now();

        return Jwts.builder().
                id(jti).
                subject(user.getId().toString()).
                issuer(issuer).
                issuedAt(Date.from(now)).
                expiration((Date.from(now.plusSeconds(refreshTtlSeconds)))).
                claim("typ", "access").
                signWith(key, Jwts.SIG.HS512).
                compact();
    }

    //    parse the token
    public Jws<Claims> parse(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
        } catch (JwtException e) {
            throw e;
        }
    }

    public boolean isAccessToken(String token) {
        Claims payload = parse(token).getPayload();
        return "access".equals(payload.get("typ"));
    }

    public boolean isRefreshToken(String token) {
        Claims payload = parse(token).getPayload();
        return "refresh".equals(payload.get("typ"));
    }

    public UUID getUserId(String token) {
        Claims payload = parse(token).getPayload();
        return UUID.fromString(payload.getSubject());
    }

    public String getJti(String token) {
        return parse(token).getPayload().getId();
    }
}
