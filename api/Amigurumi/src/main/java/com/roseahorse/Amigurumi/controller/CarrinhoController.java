package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.ItemCarrinho;
import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.model.Usuario;
import com.roseahorse.Amigurumi.repository.ItemCarrinhoRepository;
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
@RequestMapping("/api/carrinho")
@CrossOrigin(origins = "*")
public class CarrinhoController {

    @Autowired
    private ItemCarrinhoRepository itemCarrinhoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/adicionar")
    @Transactional
    public ResponseEntity<?> adicionarAoCarrinho(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, Object> request) {

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

        Long produtoId = Long.valueOf(request.get("produtoId").toString());
        Integer quantidade = Integer.valueOf(request.get("quantidade").toString());
        Double precoUnitario = Double.valueOf(request.get("precoUnitario").toString());
        if (quantidade <= 0) {
            return ResponseEntity.status(400).body("Quantidade deve ser maior que zero");
        }

        Produto produto = produtoRepository.findById(produtoId).orElse(null);
        if (produto == null) {
            return ResponseEntity.status(404).body("Produto não encontrado");
        }

        if (produto.getQuantidade() < quantidade) {
            return ResponseEntity.status(400).body("Quantidade indisponível em estoque");
        }

        ItemCarrinho itemExistente = itemCarrinhoRepository
                .findByUsuarioIdAndProdutoId(usuario.getId(), produtoId)
                .orElse(null);

        if (itemExistente != null) {
            int novaQuantidade = itemExistente.getQuantidade() + quantidade;

            if (produto.getQuantidade() < novaQuantidade) {
                return ResponseEntity.status(400).body("Quantidade total excede o estoque disponível");
            }

            itemExistente.setQuantidade(novaQuantidade);
            itemCarrinhoRepository.save(itemExistente);
        } else {
            ItemCarrinho novoItem = new ItemCarrinho(usuario, produto, quantidade, precoUnitario);
            itemCarrinhoRepository.save(novoItem);
        }

        return ResponseEntity.ok(Map.of("mensagem", "Produto adicionado ao carrinho"));
    }

    @GetMapping
    public ResponseEntity<?> listarCarrinho(
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

        List<ItemCarrinho> itens = itemCarrinhoRepository.findByUsuarioId(usuario.getId());

        List<Map<String, Object>> itensResponse = itens.stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("produtoId", item.getProduto().getId());
            itemMap.put("produtoNome", item.getProduto().getNome());
            itemMap.put("produtoDescricao", item.getProduto().getDescricao());
            itemMap.put("quantidade", item.getQuantidade());
            itemMap.put("precoUnitario", item.getPrecoUnitario());
            itemMap.put("subtotal", item.getSubtotal());
            itemMap.put("estoqueDisponivel", item.getProduto().getQuantidade());
            return itemMap;
        }).collect(Collectors.toList());

        Double valorTotal = itens.stream()
                .mapToDouble(ItemCarrinho::getSubtotal)
                .sum();

        return ResponseEntity.ok(Map.of(
                "itens", itensResponse,
                "valorTotal", valorTotal
        ));
    }

    @PutMapping("/{itemId}")
    @Transactional
    public ResponseEntity<?> atualizarQuantidade(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request) {

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

        ItemCarrinho item = itemCarrinhoRepository.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(404).body("Item não encontrado no carrinho");
        }

        if (!item.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Integer novaQuantidade = request.get("quantidade");
        if (novaQuantidade <= 0) {
            return ResponseEntity.status(400).body("Quantidade deve ser maior que zero");
        }

        if (item.getProduto().getQuantidade() < novaQuantidade) {
            return ResponseEntity.status(400).body("Quantidade indisponível em estoque");
        }

        item.setQuantidade(novaQuantidade);
        itemCarrinhoRepository.save(item);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Quantidade atualizada",
                "novaQuantidade", novaQuantidade,
                "subtotal", item.getSubtotal()
        ));
    }

    @DeleteMapping("/{itemId}")
    @Transactional
    public ResponseEntity<?> removerItem(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long itemId) {

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

        ItemCarrinho item = itemCarrinhoRepository.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(404).body("Item não encontrado no carrinho");
        }

        if (!item.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        itemCarrinhoRepository.delete(item);

        return ResponseEntity.ok(Map.of("mensagem", "Item removido do carrinho"));
    }

    @DeleteMapping("/limpar")
    @Transactional
    public ResponseEntity<?> limparCarrinho(
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

        itemCarrinhoRepository.deleteByUsuarioId(usuario.getId());

        return ResponseEntity.ok(Map.of("mensagem", "Carrinho limpo com sucesso"));
    }

    @GetMapping("/count")
    public ResponseEntity<?> contarItens(
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

        long count = itemCarrinhoRepository.countByUsuarioId(usuario.getId());

        return ResponseEntity.ok(Map.of("quantidade", count));
    }
}