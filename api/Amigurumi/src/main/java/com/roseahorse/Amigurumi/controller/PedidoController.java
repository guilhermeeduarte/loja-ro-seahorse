package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.*;
import com.roseahorse.Amigurumi.repository.ItemCarrinhoRepository;
import com.roseahorse.Amigurumi.repository.PedidoRepository;
import com.roseahorse.Amigurumi.repository.ProdutoRepository;
import com.roseahorse.Amigurumi.repository.UsuarioRepository;
import com.roseahorse.Amigurumi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemCarrinhoRepository itemCarrinhoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/finalizar")
    @Transactional
    public ResponseEntity<?> finalizarCompra(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestBody Map<String, String> request) {

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

        List<ItemCarrinho> itensCarrinho = itemCarrinhoRepository.findByUsuario_Id(usuario.getId());

        if (itensCarrinho.isEmpty()) {
            return ResponseEntity.status(400).body("Carrinho vazio");
        }

        String enderecoEntrega = request.get("enderecoEntrega");
        String formaPagamento = request.get("formaPagamento");

        if (enderecoEntrega == null || enderecoEntrega.trim().isEmpty()) {
            enderecoEntrega = usuario.getEndereco();
        }

        if (formaPagamento == null || formaPagamento.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Forma de pagamento é obrigatória");
        }

        for (ItemCarrinho itemCarrinho : itensCarrinho) {
            Produto produto = itemCarrinho.getProduto();
            if (produto.getQuantidade() < itemCarrinho.getQuantidade()) {
                return ResponseEntity.status(400).body(
                        "Produto " + produto.getNome() + " sem estoque suficiente"
                );
            }
        }

        Pedido pedido = new Pedido(usuario, enderecoEntrega, formaPagamento);

        for (ItemCarrinho itemCarrinho : itensCarrinho) {
            Produto produto = itemCarrinho.getProduto();

            ItemPedido itemPedido = new ItemPedido(
                    produto,
                    itemCarrinho.getQuantidade(),
                    itemCarrinho.getPrecoUnitario()
            );
            pedido.adicionarItem(itemPedido);

            produto.setQuantidade(produto.getQuantidade() - itemCarrinho.getQuantidade());
            produtoRepository.save(produto);
        }

        pedido.calcularValorTotal();
        pedidoRepository.save(pedido);

        itemCarrinhoRepository.deleteByUsuario_Id(usuario.getId());

        return ResponseEntity.ok(Map.of(
                "mensagem", "Pedido criado com sucesso",
                "pedidoId", pedido.getId(),
                "valorTotal", pedido.getValorTotal()
        ));
    }

    @GetMapping("/meus-pedidos")
    public ResponseEntity<?> listarMeusPedidos(
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

        List<Pedido> pedidos = pedidoRepository.findByUsuarioIdOrderByDataPedidoDesc(usuario.getId());

        List<Map<String, Object>> pedidosResponse = pedidos.stream().map(pedido -> {
            Map<String, Object> pedidoMap = new HashMap<>();
            pedidoMap.put("id", pedido.getId());
            pedidoMap.put("status", pedido.getStatus());
            pedidoMap.put("valorTotal", pedido.getValorTotal());
            pedidoMap.put("dataPedido", pedido.getDataPedido());
            pedidoMap.put("dataPagamento", pedido.getDataPagamento());
            pedidoMap.put("dataEnvio", pedido.getDataEnvio());
            pedidoMap.put("dataEntrega", pedido.getDataEntrega());
            pedidoMap.put("formaPagamento", pedido.getFormaPagamento());
            pedidoMap.put("enderecoEntrega", pedido.getEnderecoEntrega());

            List<Map<String, Object>> itens = pedido.getItens().stream().map(item -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("produtoId", item.getProduto().getId());
                itemMap.put("produtoNome", item.getProduto().getNome());
                itemMap.put("quantidade", item.getQuantidade());
                itemMap.put("precoUnitario", item.getPrecoUnitario());
                itemMap.put("subtotal", item.getSubtotal());
                return itemMap;
            }).collect(Collectors.toList());

            pedidoMap.put("itens", itens);
            return pedidoMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(pedidosResponse);
    }

    @GetMapping("/{pedidoId}")
    public ResponseEntity<?> detalhesPedido(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long pedidoId) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);

        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido não encontrado");
        }

        if (!pedido.getUsuario().getId().equals(usuario.getId()) &&
                usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Map<String, Object> pedidoMap = new HashMap<>();
        pedidoMap.put("id", pedido.getId());
        pedidoMap.put("status", pedido.getStatus());
        pedidoMap.put("valorTotal", pedido.getValorTotal());
        pedidoMap.put("dataPedido", pedido.getDataPedido());
        pedidoMap.put("dataPagamento", pedido.getDataPagamento());
        pedidoMap.put("dataEnvio", pedido.getDataEnvio());
        pedidoMap.put("dataEntrega", pedido.getDataEntrega());
        pedidoMap.put("formaPagamento", pedido.getFormaPagamento());
        pedidoMap.put("enderecoEntrega", pedido.getEnderecoEntrega());

        if (usuario.getTipoUsuario() != TipoUsuario.CLIENTE) {
            pedidoMap.put("usuarioNome", pedido.getUsuario().getNome());
            pedidoMap.put("usuarioEmail", pedido.getUsuario().getEmail());
            pedidoMap.put("usuarioTelefone", pedido.getUsuario().getTelefone());
        }

        List<Map<String, Object>> itens = pedido.getItens().stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("produtoId", item.getProduto().getId());
            itemMap.put("produtoNome", item.getProduto().getNome());
            itemMap.put("quantidade", item.getQuantidade());
            itemMap.put("precoUnitario", item.getPrecoUnitario());
            itemMap.put("subtotal", item.getSubtotal());
            return itemMap;
        }).collect(Collectors.toList());

        pedidoMap.put("itens", itens);

        return ResponseEntity.ok(pedidoMap);
    }

    // Atualizar status do pedido (vendedor e admin)
    @PutMapping("/{pedidoId}/status")
    @Transactional
    public ResponseEntity<?> atualizarStatus(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long pedidoId,
            @RequestBody Map<String, String> request) {

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

        if (usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);

        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido não encontrado");
        }

        String novoStatus = request.get("status");

        try {
            StatusPedido status = StatusPedido.valueOf(novoStatus);
            pedido.setStatus(status);

            switch (status) {
                case PAGO:
                    pedido.setDataPagamento(LocalDateTime.now());
                    break;
                case ENVIADO:
                    pedido.setDataEnvio(LocalDateTime.now());
                    break;
                case ENTREGUE:
                    pedido.setDataEntrega(LocalDateTime.now());
                    break;
            }

            pedidoRepository.save(pedido);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Status atualizado com sucesso",
                    "novoStatus", status
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Status inválido");
        }
    }

    // Listar todos os pedidos (vendedor e admin)
    @GetMapping("/todos")
    public ResponseEntity<?> listarTodosPedidos(
            @CookieValue(name = "auth_token", required = false) String token,
            @RequestParam(required = false) String status) {

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

        if (usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        List<Pedido> pedidos;

        if (status != null && !status.trim().isEmpty()) {
            try {
                StatusPedido statusEnum = StatusPedido.valueOf(status);
                pedidos = pedidoRepository.findByStatus(statusEnum);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(400).body("Status inválido");
            }
        } else {
            pedidos = pedidoRepository.findAllByOrderByDataPedidoDesc();
        }

        List<Map<String, Object>> pedidosResponse = pedidos.stream().map(pedido -> {
            Map<String, Object> pedidoMap = new HashMap<>();
            pedidoMap.put("id", pedido.getId());
            pedidoMap.put("usuarioNome", pedido.getUsuario().getNome());
            pedidoMap.put("usuarioEmail", pedido.getUsuario().getEmail());
            pedidoMap.put("status", pedido.getStatus());
            pedidoMap.put("valorTotal", pedido.getValorTotal());
            pedidoMap.put("dataPedido", pedido.getDataPedido());
            pedidoMap.put("formaPagamento", pedido.getFormaPagamento());
            pedidoMap.put("enderecoEntrega", pedido.getEnderecoEntrega());
            return pedidoMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(pedidosResponse);
    }

    @PutMapping("/{pedidoId}/cancelar")
    @Transactional
    public ResponseEntity<?> cancelarPedido(
            @CookieValue(name = "auth_token", required = false) String token,
            @PathVariable Long pedidoId) {

        if (token == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = jwtUtil.validateToken(token);
        if (email == null) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);

        if (pedido == null) {
            return ResponseEntity.status(404).body("Pedido não encontrado");
        }

        if (!pedido.getUsuario().getId().equals(usuario.getId()) &&
                usuario.getTipoUsuario() == TipoUsuario.CLIENTE) {
            return ResponseEntity.status(403).body("Acesso negado");
        }

        if (pedido.getStatus() == StatusPedido.ENVIADO ||
                pedido.getStatus() == StatusPedido.ENTREGUE) {
            return ResponseEntity.status(400).body("Pedido já enviado, não pode ser cancelado");
        }

        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            return ResponseEntity.status(400).body("Pedido já está cancelado");
        }

        for (ItemPedido item : pedido.getItens()) {
            Produto produto = item.getProduto();
            produto.setQuantidade(produto.getQuantidade() + item.getQuantidade());
            produtoRepository.save(produto);
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok(Map.of("mensagem", "Pedido cancelado com sucesso"));
    }
}