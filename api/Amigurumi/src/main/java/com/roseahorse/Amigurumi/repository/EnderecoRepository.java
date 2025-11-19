package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    // Buscar todos os endereços de um usuário
    List<Endereco> findByUsuarioIdOrderByPrincipalDescDataCriacaoDesc(Long usuarioId);

    // Buscar endereço principal do usuário
    @Query("SELECT e FROM endereco e WHERE e.usuario.id = :usuarioId AND e.principal = true")
    Optional<Endereco> findPrincipalByUsuarioId(Long usuarioId);

    // Contar endereços de um usuário
    long countByUsuarioId(Long usuarioId);

    // Buscar endereço por ID e usuário
    Optional<Endereco> findByIdAndUsuarioId(Long id, Long usuarioId);
}