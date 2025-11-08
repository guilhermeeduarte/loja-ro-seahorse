package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Avaliacao;
import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.AvaliacaoRepository;
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
@RequestMapping("/api/avaliacao")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Criar avaliação
    @PostMapping
    @Transactional
    public ResponseEntity<?> criarAvaliacao(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, Object> request) {

        if (token == null) {
            return ResponseEntity.status(401).body("Você precisa estar logado para avaliar");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Long produtoId = Long.valueOf(request.get("produtoId").toString());
        Integer nota = Integer.valueOf(request.get("nota").toString());
        String comentario = request.get("comentario") != null ? request.get("comentario").toString() : "";

        // Validar nota
        if (nota < 1 || nota > 5) {
            return ResponseEntity.status(400).body("Nota deve ser entre 1 e 5");
        }

        // Verificar se produto existe
        Produto produto = produtoRepository.findByIdAndNotDeleted(produtoId).orElse(null);
        if (produto == null) {
            return ResponseEntity.status(404).body("Produto não encontrado");
        }

        // Verificar se usuário já avaliou
        var avaliacaoExistente = avaliacaoRepository.findByUsuarioIdAndProdutoId(usuario.getId(), produtoId);
        if (avaliacaoExistente.isPresent()) {
            return ResponseEntity.status(400).body("Você já avaliou este produto");
        }

        Avaliacao avaliacao = new Avaliacao(usuario, produto, nota, comentario);
        avaliacaoRepository.save(avaliacao);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Avaliação criada com sucesso",
                "avaliacaoId", avaliacao.getId()
        ));
    }

    // Listar avaliações de um produto
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<?> listarAvaliacoesProduto(@PathVariable Long produtoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByProdutoIdAndNotDeleted(produtoId);

        List<Map<String, Object>> avaliacoesResponse = avaliacoes.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("usuarioNome", a.getUsuario().getNome());
            map.put("nota", a.getNota());
            map.put("comentario", a.getComentario());
            map.put("dataAvaliacao", a.getDataAvaliacao());
            return map;
        }).collect(Collectors.toList());

        Long totalAvaliacoes = avaliacaoRepository.countByProdutoId(produtoId);
        Double mediaNotas = avaliacaoRepository.calcularMediaNotas(produtoId);

        return ResponseEntity.ok(Map.of(
                "avaliacoes", avaliacoesResponse,
                "totalAvaliacoes", totalAvaliacoes,
                "mediaNotas", mediaNotas != null ? mediaNotas : 0.0
        ));
    }

    // Verificar se usuário já avaliou
    @GetMapping("/verificar/{produtoId}")
    public ResponseEntity<?> verificarAvaliacao(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long produtoId) {

        if (token == null) {
            return ResponseEntity.ok(Map.of("jaAvaliou", false));
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.ok(Map.of("jaAvaliou", false));
        }

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        if (usuario == null) {
            return ResponseEntity.ok(Map.of("jaAvaliou", false));
        }

        boolean jaAvaliou = avaliacaoRepository.findByUsuarioIdAndProdutoId(usuario.getId(), produtoId).isPresent();
        return ResponseEntity.ok(Map.of("jaAvaliou", jaAvaliou));
    }

    // Deletar avaliação (usuário pode deletar a própria)
    @DeleteMapping("/{avaliacaoId}")
    @Transactional
    public ResponseEntity<?> deletarAvaliacao(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long avaliacaoId) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId).orElse(null);

        if (avaliacao == null) {
            return ResponseEntity.status(404).body("Avaliação não encontrada");
        }

        // Verifica se é o dono da avaliação ou admin
        if (!avaliacao.getUsuario().getId().equals(usuario.getId())
                && !usuario.getTipoUsuario().toString().equals("ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        avaliacao.excluir();
        avaliacaoRepository.save(avaliacao);

        return ResponseEntity.ok(Map.of("mensagem", "Avaliação removida com sucesso"));
    }
}