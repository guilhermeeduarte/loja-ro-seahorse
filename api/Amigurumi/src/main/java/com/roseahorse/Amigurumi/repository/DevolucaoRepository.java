package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Devolucao;
import com.roseahorse.Amigurumi.model.StatusDevolucao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DevolucaoRepository extends JpaRepository<Devolucao, Long> {

    // Buscar devoluções por usuário
    List<Devolucao> findByUsuarioIdOrderByDataSolicitacaoDesc(Long usuarioId);

    // Buscar devoluções por pedido
    Optional<Devolucao> findByPedidoId(Long pedidoId);

    // Buscar por status
    List<Devolucao> findByStatusOrderByDataSolicitacaoDesc(StatusDevolucao status);

    // Listar todas ordenadas
    List<Devolucao> findAllByOrderByDataSolicitacaoDesc();

    // Verificar se já existe devolução para o pedido
    boolean existsByPedidoId(Long pedidoId);

    // Buscar devoluções pendentes de um usuário
    @Query("SELECT d FROM devolucao d WHERE d.usuario.id = :usuarioId AND d.status = 'PENDENTE'")
    List<Devolucao> findPendentesByUsuarioId(Long usuarioId);
}