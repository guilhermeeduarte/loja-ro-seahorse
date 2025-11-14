package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.*;
import com.roseahorse.Amigurumi.repository.DevolucaoRepository;
import com.roseahorse.Amigurumi.repository.PedidoRepository;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/devolucao")
@CrossOrigin(origins = "*")
public class DevolucaoController {

    @Autowired
    private DevolucaoRepository devolucaoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.upload.dir:uploads/produtos}")
    private String uploadDir;

    @PostMapping
    @Transactional
    public ResponseEntity<?> criarDevolucao(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestParam("pedidoId") Long pedidoId,
            @RequestParam("motivo") String motivo,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "imagens", required = false) List<MultipartFile> imagens) {

        if (token == null) {
            return ResponseEntity.status(401).body("Você precisa estar logado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido");
        }

        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido não encontrado");
        }

        if (!pedido.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(403).body("Este pedido não pertence a você");
        }

        if (devolucaoRepository.existsByPedidoId(pedidoId)) {
            return ResponseEntity.status(400).body("Já existe uma solicitação de devolução para este pedido");
        }

        Devolucao devolucao = new Devolucao(pedido, usuario, motivo, descricao);

        if (imagens != null && !imagens.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                for (MultipartFile file : imagens) {
                    if (!file.isEmpty()) {
                        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path filePath = uploadPath.resolve(filename);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                        DevolucaoImagem imagem = new DevolucaoImagem("/api/imagem/" + filename);
                        devolucao.adicionarImagem(imagem);
                    }
                }
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Erro ao fazer upload das imagens");
            }
        }

        devolucaoRepository.save(devolucao);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Solicitação de devolução criada com sucesso",
                "devolucaoId", devolucao.getId()
        ));
    }

    @GetMapping("/minhas")
    public ResponseEntity<?> listarMinhasDevolucoes(
            @CookieValue(name = "auth_token", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        List<Devolucao> devolucoes = devolucaoRepository.findByUsuarioIdOrderByDataSolicitacaoDesc(usuario.getId());

        List<Map<String, Object>> response = devolucoes.stream().map(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("pedidoId", d.getPedido().getId());
            map.put("motivo", d.getMotivo());
            map.put("descricao", d.getDescricao());
            map.put("status", d.getStatus());
            map.put("dataSolicitacao", d.getDataSolicitacao());
            map.put("observacoesAdmin", d.getObservacoesAdmin());
            map.put("imagens", d.getImagens().stream()
                    .map(DevolucaoImagem::getImagemUrl)
                    .collect(Collectors.toList()));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/todas")
    public ResponseEntity<?> listarTodasDevolucoes(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestParam(required = false) String status) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null || usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        List<Devolucao> devolucoes;

        if (status != null && !status.isEmpty()) {
            try {
                StatusDevolucao statusEnum = StatusDevolucao.valueOf(status);
                devolucoes = devolucaoRepository.findByStatusOrderByDataSolicitacaoDesc(statusEnum);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(400).body("Status inválido");
            }
        } else {
            devolucoes = devolucaoRepository.findAllByOrderByDataSolicitacaoDesc();
        }

        List<Map<String, Object>> response = devolucoes.stream().map(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("pedidoId", d.getPedido().getId());
            map.put("usuarioNome", d.getUsuario().getNome());
            map.put("usuarioEmail", d.getUsuario().getEmail());
            map.put("motivo", d.getMotivo());
            map.put("descricao", d.getDescricao());
            map.put("status", d.getStatus());
            map.put("dataSolicitacao", d.getDataSolicitacao());
            map.put("observacoesAdmin", d.getObservacoesAdmin());
            map.put("imagens", d.getImagens().stream()
                    .map(DevolucaoImagem::getImagemUrl)
                    .collect(Collectors.toList()));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/aprovar")
    @Transactional
    public ResponseEntity<?> aprovarDevolucao(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null || usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Devolucao devolucao = devolucaoRepository.findById(id).orElse(null);
        if (devolucao == null) {
            return ResponseEntity.status(404).body("Devolução não encontrada");
        }

        String observacoes = body != null ? body.get("observacoes") : null;
        devolucao.aprovar(observacoes);
        devolucaoRepository.save(devolucao);

        return ResponseEntity.ok(Map.of("mensagem", "Devolução aprovada"));
    }

    @PutMapping("/{id}/rejeitar")
    @Transactional
    public ResponseEntity<?> rejeitarDevolucao(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null || usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Devolucao devolucao = devolucaoRepository.findById(id).orElse(null);
        if (devolucao == null) {
            return ResponseEntity.status(404).body("Devolução não encontrada");
        }

        String observacoes = body != null ? body.get("observacoes") : null;
        devolucao.rejeitar(observacoes);
        devolucaoRepository.save(devolucao);

        return ResponseEntity.ok(Map.of("mensagem", "Devolução rejeitada"));
    }

    @PutMapping("/{id}/concluir")
    @Transactional
    public ResponseEntity<?> concluirDevolucao(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long id) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        Usuario usuario = usuarioRepository.findByEmailAndNotDeleted(email);

        if (usuario == null || usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Devolucao devolucao = devolucaoRepository.findById(id).orElse(null);
        if (devolucao == null) {
            return ResponseEntity.status(404).body("Devolução não encontrada");
        }

        devolucao.concluir();
        devolucaoRepository.save(devolucao);

        return ResponseEntity.ok(Map.of("mensagem", "Devolução concluída"));
    }
}