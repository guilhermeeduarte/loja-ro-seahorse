package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // token temporário meio broxa(talvez mudar? pedro pensadas)
    private Map<String, String> resetTokens = new HashMap<>();

    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }


        String token = java.util.UUID.randomUUID().toString();
        resetTokens.put(token, email);

        String link = "http://localhost:3000/redefinir-senha.html?token=" + token;

        emailService.enviarEmail(
                usuario.getEmail(),
                "Redefinição de senha",
                "Clique no link para redefinir sua senha: " + link
        );

        return ResponseEntity.ok("Email enviado com sucesso!");
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String novaSenha = request.get("senha");

        String email = resetTokens.get(token);
        if (email == null) {
            return ResponseEntity.status(400).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }


        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);


        resetTokens.remove(token);

        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }
}