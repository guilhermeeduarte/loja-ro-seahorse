package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.TipoUsuario;
import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.security.JwtUtil;
import com.roseahorse.Amigurumi.security.RateLimitFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        String email = loginData.get("email");
        String senha = loginData.get("senha");
        String ip = getClientIP(request);

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        if (usuario == null) {
            rateLimitFilter.recordFailedAttempt(ip);
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            rateLimitFilter.recordFailedAttempt(ip);
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        // Login bem-sucedido - reseta tentativas
        rateLimitFilter.resetAttempts(ip);

        String token = jwtUtil.generateToken(email);
        Cookie cookie = criarCookie("auth_token", token, 21600);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Login realizado com sucesso",
                "nome", usuario.getNome(),
                "tipoUsuario", usuario.getTipoUsuario().toString()
        ));
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = criarCookie("auth_token", null, 0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("mensagem", "Logout realizado com sucesso"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUsuarioLogado(@CookieValue(name = "auth_token", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
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
    public ResponseEntity<?> getPerfilCompleto(@CookieValue(name = "auth_token", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Map<String, Object> perfil = new HashMap<>();
        perfil.put("id", usuario.getId());
        perfil.put("nome", usuario.getNome());
        perfil.put("email", usuario.getEmail());
        perfil.put("telefone", usuario.getTelefone());
        perfil.put("cpf", usuario.getCpf());
        perfil.put("endereco", usuario.getEndereco());
        perfil.put("dataNascimento", usuario.getDataNascimento());
        perfil.put("tipoUsuario", usuario.getTipoUsuario().toString());

        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, String> dados) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        if (dados.containsKey("nome")) usuario.setNome(dados.get("nome"));
        if (dados.containsKey("telefone")) usuario.setTelefone(dados.get("telefone"));
        if (dados.containsKey("endereco")) usuario.setEndereco(dados.get("endereco"));

        if (dados.containsKey("senha")) {
            usuario.setSenha(passwordEncoder.encode(dados.get("senha")));
        }

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso"));
    }

    private Cookie criarCookie(String nome, String valor, int maxAge) {
        Cookie cookie = new Cookie(nome, valor);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(maxAge);

        boolean isProduction = "prod".equals(activeProfile);
        cookie.setSecure(isProduction);
        cookie.setAttribute("SameSite", isProduction ? "None" : "Lax");

        return cookie;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativarUsuario(
            @PathVariable Long id,
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String emailLogado = jwtUtil.validateToken(token);
        Usuario usuarioLogado = usuarioRepository.findByEmailAndNotDeleted(emailLogado);

        // Verifica se é ADMIN
        if (usuarioLogado == null || usuarioLogado.getTipoUsuario() != TipoUsuario.ADMINISTRADOR) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        return usuarioRepository.findByIdAndNotDeleted(id)
                .map(usuario -> {
                    usuario.excluir();
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(Map.of(
                            "mensagem", "Usuário desativado com sucesso"
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}/reativar")
    public ResponseEntity<?> reativarUsuario(
            @PathVariable Long id,
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String emailLogado = jwtUtil.validateToken(token);
        Usuario usuarioLogado = usuarioRepository.findByEmailAndNotDeleted(emailLogado);

        if (usuarioLogado == null || usuarioLogado.getTipoUsuario() != TipoUsuario.ADMINISTRADOR) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (!usuario.getExcluido()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("erro", "Usuário já está ativo"));
                    }
                    usuario.reativar();
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(Map.of(
                            "mensagem", "Usuário reativado com sucesso"
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar usuários ativos (apenas ADMIN)
    @GetMapping
    public ResponseEntity<?> listarUsuarios(
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String emailLogado = jwtUtil.validateToken(token);
        Usuario usuarioLogado = usuarioRepository.findByEmailAndNotDeleted(emailLogado);

        if (usuarioLogado == null || usuarioLogado.getTipoUsuario() != TipoUsuario.ADMINISTRADOR) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        return ResponseEntity.ok(usuarioRepository.findAllActive());
    }

    // Atualizar usuário por ID (apenas ADMIN) - permite editar nome, telefone, endereco e tipo
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuarioPorId(
            @PathVariable Long id,
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, String> dados) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String emailLogado = jwtUtil.validateToken(token);
        Usuario usuarioLogado = usuarioRepository.findByEmailAndNotDeleted(emailLogado);

        if (usuarioLogado == null || usuarioLogado.getTipoUsuario() != TipoUsuario.ADMINISTRADOR) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        return usuarioRepository.findByIdAndNotDeleted(id)
                .map(usuario -> {
                    if (dados.containsKey("nome")) usuario.setNome(dados.get("nome"));
                    if (dados.containsKey("telefone")) usuario.setTelefone(dados.get("telefone"));
                    if (dados.containsKey("endereco")) usuario.setEndereco(dados.get("endereco"));
                    if (dados.containsKey("tipoUsuario")) {
                        try {
                            usuario.setTipoUsuario(TipoUsuario.valueOf(dados.get("tipoUsuario")));
                        } catch (Exception ignored) {}
                    }
                    if (dados.containsKey("senha")) {
                        usuario.setSenha(passwordEncoder.encode(dados.get("senha")));
                    }
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}