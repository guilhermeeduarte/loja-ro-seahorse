package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    // Buscar avaliações ativas de um produto
    @Query("SELECT a FROM avaliacao a WHERE a.produto.id = :produtoId AND a.excluido = false ORDER BY a.dataAvaliacao DESC")
    List<Avaliacao> findByProdutoIdAndNotDeleted(Long produtoId);

    // Verificar se usuário já avaliou o produto
    @Query("SELECT a FROM avaliacao a WHERE a.usuario.id = :usuarioId AND a.produto.id = :produtoId AND a.excluido = false")
    Optional<Avaliacao> findByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);

    // Contar avaliações de um produto
    @Query("SELECT COUNT(a) FROM avaliacao a WHERE a.produto.id = :produtoId AND a.excluido = false")
    Long countByProdutoId(Long produtoId);

    // Calcular média de notas de um produto
    @Query("SELECT AVG(a.nota) FROM avaliacao a WHERE a.produto.id = :produtoId AND a.excluido = false")
    Double calcularMediaNotas(Long produtoId);

    // Buscar avaliações de um usuário
    @Query("SELECT a FROM avaliacao a WHERE a.usuario.id = :usuarioId AND a.excluido = false ORDER BY a.dataAvaliacao DESC")
    List<Avaliacao> findByUsuarioId(Long usuarioId);
}