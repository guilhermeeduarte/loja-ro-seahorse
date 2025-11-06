package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.ListaDesejo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ListaDesejoRepository extends JpaRepository<ListaDesejo, Long> {

    List<ListaDesejo> findByUsuarioId(Long usuarioId);

    Optional<ListaDesejo> findByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);

    boolean existsByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);

    void deleteByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);
}