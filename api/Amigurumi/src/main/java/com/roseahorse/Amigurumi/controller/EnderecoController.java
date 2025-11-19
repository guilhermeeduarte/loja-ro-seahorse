package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Endereco;
import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.EnderecoRepository;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/endereco")
@CrossOrigin(origins = "*")
public class EnderecoController {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> listarEnderecos(
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        List<Endereco> enderecos = enderecoRepository.findByUsuarioIdOrderByPrincipalDescDataCriacaoDesc(usuario.getId());

        List<Map<String, Object>> response = enderecos.stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId());
            map.put("apelido", e.getApelido());
            map.put("cep", e.getCep());
            map.put("pais", e.getPais());
            map.put("estado", e.getEstado());
            map.put("cidade", e.getCidade());
            map.put("bairro", e.getBairro());
            map.put("rua", e.getRua());
            map.put("numero", e.getNumero());
            map.put("complemento", e.getComplemento());
            map.put("observacoes", e.getObservacoes());
            map.put("principal", e.getPrincipal());
            map.put("enderecoCompleto", e.getEnderecoCompleto());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrarEndereco(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, Object> request) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        // Valida campos obrigatórios
        if (!request.containsKey("apelido") || !request.containsKey("cep") ||
                !request.containsKey("estado") || !request.containsKey("cidade") ||
                !request.containsKey("rua") || !request.containsKey("numero")) {
            return ResponseEntity.status(400).body("Campos obrigatórios faltando");
        }

        Endereco endereco = new Endereco();
        endereco.setUsuario(usuario);
        endereco.setApelido((String) request.get("apelido"));
        endereco.setCep((String) request.get("cep"));
        endereco.setPais((String) request.getOrDefault("pais", "Brasil"));
        endereco.setEstado((String) request.get("estado"));
        endereco.setCidade((String) request.get("cidade"));
        endereco.setBairro((String) request.get("bairro"));
        endereco.setRua((String) request.get("rua"));
        endereco.setNumero((String) request.get("numero"));
        endereco.setComplemento((String) request.get("complemento"));
        endereco.setObservacoes((String) request.get("observacoes"));

        // Se for marcado como principal OU se for o primeiro endereço
        boolean setPrincipal = (Boolean) request.getOrDefault("principal", false);
        long totalEnderecos = enderecoRepository.countByUsuarioId(usuario.getId());

        if (setPrincipal || totalEnderecos == 0) {
            // Remove principal de outros endereços
            enderecoRepository.findPrincipalByUsuarioId(usuario.getId())
                    .ifPresent(e -> {
                        e.setPrincipal(false);
                        enderecoRepository.save(e);
                    });
            endereco.setPrincipal(true);
        }

        enderecoRepository.save(endereco);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Endereço cadastrado com sucesso",
                "enderecoId", endereco.getId()
        ));
    }

    @PutMapping("/{id}/principal")
    @Transactional
    public ResponseEntity<?> definirComoPrincipal(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long id) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Endereco endereco = enderecoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElse(null);

        if (endereco == null) {
            return ResponseEntity.status(404).body("Endereço não encontrado");
        }

        // Remove principal de outros endereços
        enderecoRepository.findPrincipalByUsuarioId(usuario.getId())
                .ifPresent(e -> {
                    e.setPrincipal(false);
                    enderecoRepository.save(e);
                });

        // Define este como principal
        endereco.setPrincipal(true);
        enderecoRepository.save(endereco);

        return ResponseEntity.ok(Map.of("mensagem", "Endereço definido como principal"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarEndereco(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long id) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        Endereco endereco = enderecoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElse(null);

        if (endereco == null) {
            return ResponseEntity.status(404).body("Endereço não encontrado");
        }

        boolean eraPrincipal = endereco.getPrincipal();
        enderecoRepository.delete(endereco);

        // Se era principal, define o próximo como principal
        if (eraPrincipal) {
            List<Endereco> enderecos = enderecoRepository.findByUsuarioIdOrderByPrincipalDescDataCriacaoDesc(usuario.getId());
            if (!enderecos.isEmpty()) {
                enderecos.get(0).setPrincipal(true);
                enderecoRepository.save(enderecos.get(0));
            }
        }

        return ResponseEntity.ok(Map.of("mensagem", "Endereço removido com sucesso"));
    }

    @GetMapping("/principal")
    public ResponseEntity<?> buscarEnderecoPrincipal(
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Endereco endereco = enderecoRepository.findPrincipalByUsuarioId(usuario.getId())
                .orElse(null);

        if (endereco == null) {
            return ResponseEntity.ok(Map.of("temEndereco", false));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("temEndereco", true);
        response.put("id", endereco.getId());
        response.put("apelido", endereco.getApelido());
        response.put("enderecoCompleto", endereco.getEnderecoCompleto());

        return ResponseEntity.ok(response);
    }
}