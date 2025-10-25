package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {

    List<ItemCarrinho> findByUsuarioId(Long usuarioId);

    Optional<ItemCarrinho> findByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);

    @Modifying
    @Query("DELETE FROM ItemCarrinho ic WHERE ic.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Long usuarioId);

    long countByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);
}