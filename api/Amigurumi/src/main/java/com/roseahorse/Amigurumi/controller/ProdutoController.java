package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produto")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();

        // Retorna apenas produtos com estoque disponível
        List<Map<String, Object>> produtosDisponiveis = produtos.stream()
                .filter(p -> p.getQuantidade() > 0)
                .map(produto -> {
                    Map<String, Object> produtoMap = new HashMap<>();
                    produtoMap.put("id", produto.getId());
                    produtoMap.put("nome", produto.getNome());
                    produtoMap.put("descricao", produto.getDescricao());
                    produtoMap.put("valor", produto.getValor());
                    produtoMap.put("quantidade", produto.getQuantidade());
                    produtoMap.put("categoria", produto.getCategoria());
                    return produtoMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(produtosDisponiveis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarProdutoPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    Map<String, Object> produtoMap = new HashMap<>();
                    produtoMap.put("id", produto.getId());
                    produtoMap.put("nome", produto.getNome());
                    produtoMap.put("descricao", produto.getDescricao());
                    produtoMap.put("valor", produto.getValor());
                    produtoMap.put("quantidade", produto.getQuantidade());
                    produtoMap.put("categoria", produto.getCategoria());
                    return ResponseEntity.ok(produtoMap);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Map<String, Object>>> listarPorCategoria(@PathVariable String categoria) {
        List<Produto> produtos = produtoRepository.findAll().stream()
                .filter(p -> p.getCategoria().equalsIgnoreCase(categoria) && p.getQuantidade() > 0)
                .collect(Collectors.toList());

        List<Map<String, Object>> produtosMap = produtos.stream()
                .map(produto -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", produto.getId());
                    map.put("nome", produto.getNome());
                    map.put("descricao", produto.getDescricao());
                    map.put("valor", produto.getValor());
                    map.put("quantidade", produto.getQuantidade());
                    map.put("categoria", produto.getCategoria());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(produtosMap);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setNome(produtoAtualizado.getNome());
                    produto.setDescricao(produtoAtualizado.getDescricao());
                    produto.setValor(produtoAtualizado.getValor());
                    produto.setQuantidade(produtoAtualizado.getQuantidade());
                    produto.setCategoria(produtoAtualizado.getCategoria());
                    produtoRepository.save(produto);
                    return ResponseEntity.ok(produto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscarProdutos(@RequestParam String termo) {
        List<Produto> produtos = produtoRepository.buscarPorNomeOuDescricao(termo);

        List<Map<String, Object>> produtosMap = produtos.stream()
                .filter(p -> p.getQuantidade() > 0)
                .map(produto -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", produto.getId());
                    map.put("nome", produto.getNome());
                    map.put("descricao", produto.getDescricao());
                    map.put("valor", produto.getValor());
                    map.put("quantidade", produto.getQuantidade());
                    map.put("categoria", produto.getCategoria());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(produtosMap);
    }
}