package com.roseahorse.Amigurumi.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationTime;

    public JwtUtil(
            @Value("${jwt.secret:}") String secret,
            @Value("${jwt.expiration:3600000}") long expirationTime
    ) {
        this.expirationTime = expirationTime;

        if (secret == null || secret.trim().isEmpty()) {
            System.err.println("⚠️ AVISO: JWT_SECRET não configurado! Usando chave padrão (INSEGURO EM PRODUÇÃO)");
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        } else {
            try {

                byte[] keyBytes = Base64.getDecoder().decode(secret);
                this.key = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
                System.out.println("JWT_SECRET carregado com sucesso!");
            } catch (IllegalArgumentException e) {
                System.err.println("ERRO: JWT_SECRET inválido! Use Base64.");
                throw new RuntimeException("JWT_SECRET deve estar em formato Base64", e);
            }
        }
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (Exception e) {
            System.err.println("Erro ao validar token: " + e.getMessage());
            return null;
        }
    }
}