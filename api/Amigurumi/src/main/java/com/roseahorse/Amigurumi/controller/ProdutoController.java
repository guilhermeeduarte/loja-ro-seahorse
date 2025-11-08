package com.roseahorse.Amigurumi.controller;

import com.roseahorse.Amigurumi.model.Produto;
import com.roseahorse.Amigurumi.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produto")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        // Garante que o produto não seja criado como excluído
        produto.setExcluido(false);
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAllActive();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarProdutoPorId(@PathVariable Long id) {
        return produtoRepository.findByIdAndNotDeleted(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(
            @PathVariable Long id,
            @RequestBody Produto produtoAtualizado) {

        return produtoRepository.findByIdAndNotDeleted(id)
                .map(produto -> {
                    produto.setNome(produtoAtualizado.getNome());
                    produto.setDescricao(produtoAtualizado.getDescricao());
                    produto.setValor(produtoAtualizado.getValor());
                    produto.setQuantidade(produtoAtualizado.getQuantidade());
                    produto.setCategoria(produtoAtualizado.getCategoria());
                    produto.setImagemUrl(produtoAtualizado.getImagemUrl());
                    // ✅ Não permite alterar o status de exclusão via update normal
                    produtoRepository.save(produto);
                    return ResponseEntity.ok(produto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirProduto(@PathVariable Long id) {
        return produtoRepository.findByIdAndNotDeleted(id)
                .map(produto -> {
                    produto.excluir(); // Marca como excluído
                    produtoRepository.save(produto);
                    return ResponseEntity.ok(Map.of(
                            "mensagem", "Produto excluído com sucesso",
                            "id", id
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //Reativar produto excluído (apenas para ADMIN)
    @PutMapping("/{id}/reativar")
    public ResponseEntity<?> reativarProduto(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    if (!produto.getExcluido()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("erro", "Produto já está ativo"));
                    }
                    produto.reativar();
                    produtoRepository.save(produto);
                    return ResponseEntity.ok(Map.of(
                            "mensagem", "Produto reativado com sucesso",
                            "id", id
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscarProdutos(@RequestParam String termo) {
        // ✅ Busca apenas produtos ativos
        List<Produto> produtos = produtoRepository.buscarPorNomeOuDescricao(termo);
        return ResponseEntity.ok(produtos);
    }

    // (apenas para ADMIN)
    @GetMapping("/excluidos")
    public ResponseEntity<List<Produto>> listarProdutosExcluidos() {
        List<Produto> produtosExcluidos = produtoRepository.findAll().stream()
                .filter(Produto::getExcluido)
                .toList();
        return ResponseEntity.ok(produtosExcluidos);
    }
}