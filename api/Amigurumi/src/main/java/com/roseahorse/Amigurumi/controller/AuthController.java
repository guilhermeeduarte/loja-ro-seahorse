package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowCredentials = "true") // Deixa o SecurityConfig gerenciar CORS
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url:http://localhost:63342}")
    private String frontendUrl;

    // Armazena tokens temporários com timestamp de expiração
    // Em produção com múltiplas instâncias, usar Redis ou banco de dados!
    private final Map<String, TokenData> resetTokens = new ConcurrentHashMap<>();

    private static class TokenData {
        String email;
        LocalDateTime expiresAt;

        TokenData(String email, LocalDateTime expiresAt) {
            this.email = email;
            this.expiresAt = expiresAt;
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Email é obrigatório");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {

            return ResponseEntity.ok("Se o email existir, você receberá um link de redefinição");
        }

        String token = UUID.randomUUID().toString();

        // Token expira em 1 hora
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1);
        resetTokens.put(token, new TokenData(email, expiresAt));

        limparTokensExpirados();

        String link = frontendUrl + "/redefinir-senha.html?token=" + token;

        String mensagem = String.format(
                "Olá %s,\n\n" +
                        "Recebemos uma solicitação para redefinir sua senha.\n\n" +
                        "Clique no link abaixo para redefinir sua senha:\n%s\n\n" +
                        "Este link expira em 1 hora.\n\n" +
                        "Se você não solicitou esta alteração, ignore este email.\n\n" +
                        "Atenciosamente,\n" +
                        "Equipe Ro-SeaHorse",
                usuario.getNome(),
                link
        );

        try {
            emailService.enviarEmail(
                    usuario.getEmail(),
                    "Redefinição de senha - RO SeaHorse",
                    mensagem
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
            return ResponseEntity.status(500).body("Erro ao enviar email. Tente novamente mais tarde.");
        }

        return ResponseEntity.ok("Se o email existir, você receberá um link de redefinição");
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String novaSenha = request.get("senha");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Token é obrigatório");
        }

        if (novaSenha == null || novaSenha.length() < 6) {
            return ResponseEntity.status(400).body("A senha deve ter pelo menos 6 caracteres");
        }

        TokenData tokenData = resetTokens.get(token);

        if (tokenData == null) {
            return ResponseEntity.status(400).body("Token inválido ou expirado");
        }


        if (tokenData.isExpired()) {
            resetTokens.remove(token);
            return ResponseEntity.status(400).body("Token expirado. Solicite um novo link.");
        }


        Usuario usuario = usuarioRepository.findByEmail(tokenData.email);
        if (usuario == null) {
            resetTokens.remove(token);
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }


        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);


        resetTokens.remove(token);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Senha redefinida com sucesso!",
                "redirecionar", "/login.html"
        ));
    }

    // Método para validar se um token é válido (opcional - útil para o frontend)
    @GetMapping("/validar-token")
    public ResponseEntity<?> validarToken(@RequestParam String token) {
        TokenData tokenData = resetTokens.get(token);

        if (tokenData == null || tokenData.isExpired()) {
            return ResponseEntity.status(400).body(Map.of(
                    "valido", false,
                    "mensagem", "Token inválido ou expirado"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "valido", true,
                "expiresAt", tokenData.expiresAt.toString()
        ));
    }

    // Método auxiliar para limpar tokens expirados
    private void limparTokensExpirados() {
        resetTokens.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}