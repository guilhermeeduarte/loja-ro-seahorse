package com.roseahorse.Amigurumi.repository;

import com.roseahorse.Amigurumi.model.Pedido;
import com.roseahorse.Amigurumi.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioIdOrderByDataPedidoDesc(Long usuarioId);

    List<Pedido> findByStatus(StatusPedido status);

    List<Pedido> findByUsuarioIdAndStatus(Long usuarioId, StatusPedido status);

    List<Pedido> findAllByOrderByDataPedidoDesc();
}