package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {

    List<ItemCarrinho> findByUsuario_Id(Long usuarioId);

    Optional<ItemCarrinho> findByUsuario_IdAndProduto_Id(Long usuarioId, Long produtoId);

    @Modifying
    void deleteByUsuarioId(Long usuarioId);

    long countByUsuarioId(Long usuarioId);

    boolean existsByUsuario_IdAndProduto_Id(Long usuarioId, Long produtoId);
}