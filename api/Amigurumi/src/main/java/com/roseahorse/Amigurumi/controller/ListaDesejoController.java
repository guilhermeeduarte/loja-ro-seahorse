package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.ListaDesejo;
import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.ListaDesejoRepository;
import com.roseahorse.Amigurumi.repository.ProdutoRepository;
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
@RequestMapping("/api/lista-desejo")
@CrossOrigin(origins = "*")
public class ListaDesejoController {

    @Autowired
    private ListaDesejoRepository listaDesejoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/adicionar/{produtoId}")
    @Transactional
    public ResponseEntity<?> adicionarAListaDesejo(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long produtoId) {

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

        Produto produto = produtoRepository.findById(produtoId).orElse(null);
        if (produto == null) {
            return ResponseEntity.status(404).body("Produto não encontrado");
        }

        // Verifica se já está na lista
        if (listaDesejoRepository.existsByUsuarioIdAndProdutoId(usuario.getId(), produtoId)) {
            return ResponseEntity.status(400).body("Produto já está na lista de desejos");
        }

        ListaDesejo novoItem = new ListaDesejo(usuario, produto);
        listaDesejoRepository.save(novoItem);

        return ResponseEntity.ok(Map.of("mensagem", "Produto adicionado à lista de desejos"));
    }

    @GetMapping
    public ResponseEntity<?> listarDesejos(
            @CookieValue(name = "auth_token", required = false) String token) {

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

        List<ListaDesejo> desejos = listaDesejoRepository.findByUsuarioId(usuario.getId());

        List<Map<String, Object>> desejosResponse = desejos.stream().map(desejo -> {
            Map<String, Object> desejoMap = new HashMap<>();
            desejoMap.put("id", desejo.getId());
            desejoMap.put("produtoId", desejo.getProduto().getId());
            desejoMap.put("produtoNome", desejo.getProduto().getNome());
            desejoMap.put("produtoDescricao", desejo.getProduto().getDescricao());
            desejoMap.put("produtoValor", desejo.getProduto().getValor());
            desejoMap.put("imagemUrl", desejo.getProduto().getImagemUrl());
            return desejoMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(desejosResponse);
    }

    @DeleteMapping("/{produtoId}")
    @Transactional
    public ResponseEntity<?> removerDaListaDesejo(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long produtoId) {

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

        listaDesejoRepository.deleteByUsuarioIdAndProdutoId(usuario.getId(), produtoId);

        return ResponseEntity.ok(Map.of("mensagem", "Produto removido da lista de desejos"));
    }

    @GetMapping("/verificar/{produtoId}")
    public ResponseEntity<?> verificarSeEstaNoDesejo(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long produtoId) {

        if (token == null) {
            return ResponseEntity.ok(Map.of("estaNoDesejo", false));
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.ok(Map.of("estaNoDesejo", false));
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.ok(Map.of("estaNoDesejo", false));
        }

        boolean estaNoDesejo = listaDesejoRepository.existsByUsuarioIdAndProdutoId(usuario.getId(), produtoId);
        return ResponseEntity.ok(Map.of("estaNoDesejo", estaNoDesejo));
    }
}