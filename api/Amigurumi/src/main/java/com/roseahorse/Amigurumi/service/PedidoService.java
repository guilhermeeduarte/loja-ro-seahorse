package com.roseahorse.Amigurumi.service;

import com.roseahorse.Amigurumi.model.Pedido;
import com.roseahorse.Amigurumi.model.StatusPedido;
import com.roseahorse.Amigurumi.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    public void marcarComoPago(String externalReference) {
        Long pedidoId = Long.valueOf(externalReference);
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus(StatusPedido.PAGO);
        pedido.setDataPagamento(LocalDateTime.now());

        pedidoRepository.save(pedido);
    }
}