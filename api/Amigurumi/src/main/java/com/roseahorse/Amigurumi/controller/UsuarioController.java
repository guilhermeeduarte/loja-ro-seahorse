package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "http://127.0.0.1:5500/", allowCredentials = "true")

public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email já cadastrado");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletResponse response) {
        String email = loginData.get("email");
        String senha = loginData.get("senha");

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        String token = jwtUtil.generateToken(email);
        Cookie cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);   // mudar para true quando hospedar o site
        cookie.setPath("/");
        cookie.setMaxAge(21600);    // 21600s = 6 horas
        cookie.setAttribute("SameSite", "Lax");  //Mudar de lax para "Strict" caso hospede o site

        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Login realizado com sucesso",
                "nome", usuario.getNome()
        ));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("mensagem", "Logout realizado com sucesso"));
    }
    @GetMapping("/me")
    public ResponseEntity<?> getUsuarioLogado(@CookieValue(name = "auth_token", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = JwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        return ResponseEntity.ok(Map.of(
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "telefone", usuario.getTelefone(),
                "endereco", usuario.getEndereco()
        ));
    }
    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfil(@CookieValue(name = "auth_token", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = JwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        usuario.setSenha(null);

        return ResponseEntity.ok(usuario);
    }

}