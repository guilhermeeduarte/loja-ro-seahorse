package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Pedido;
import com.roseahorse.Amigurumi.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Buscar pedidos de um usuário ordenados por data (mais recente primeiro)
    List<Pedido> buscarUsuarioDataPedido(Long usuarioId);

    // Buscar pedidos por status
    List<Pedido> buscarPorStatus(StatusPedido status);

    // Buscar pedidos de um usuário por status
    List<Pedido> buscarUsuarioIdiStatus(Long usuarioId, StatusPedido status);

    // Buscar todos pedidos ordenados por data
    List<Pedido> buscarDataPedidoDesc();
}