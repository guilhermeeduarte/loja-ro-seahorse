package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.ItemCarrinho;
import jakarta.transaction.Transactional;
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
    @Transactional
    @Query("DELETE FROM ItemCarrinho i WHERE i.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Long usuarioId);


    long countByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);
}