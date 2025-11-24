package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {


    @Query(value = "SELECT * FROM produto WHERE " +
            "excluido = false AND (" +
            "nome ILIKE CONCAT('%', :termo, '%') OR " +
            "descricao ILIKE CONCAT('%', :termo, '%'))",
            nativeQuery = true)
    List<Produto> buscarPorNomeOuDescricao(@Param("termo") String termo);


    @Query("SELECT p FROM produto p WHERE p.excluido = false")
    List<Produto> findAllActive();


    @Query("SELECT p FROM produto p WHERE p.id = :id AND p.excluido = false")
    Optional<Produto> findByIdAndNotDeleted(Long id);


    @Query("SELECT p FROM produto p WHERE p.categoria = :categoria AND p.excluido = false")
    List<Produto> findByCategoriaAndNotDeleted(String categoria);


    @Query(value = "SELECT * FROM produtos_disponiveis", nativeQuery = true)
    List<Produto> findAllAvailable();
}