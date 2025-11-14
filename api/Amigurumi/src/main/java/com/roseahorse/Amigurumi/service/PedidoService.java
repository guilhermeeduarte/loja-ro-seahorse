package com.roseahorse.Amigurumi.service;

import com.roseahorse.Amigurumi.model.Pedido;
import com.roseahorse.Amigurumi.model.StatusPedido;
import com.roseahorse.Amigurumi.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Transactional
    public void marcarComoPago(String externalReference) {
        try {
            Long pedidoId = Long.valueOf(externalReference);
            Pedido pedido = pedidoRepository.findById(pedidoId)
                    .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + pedidoId));

            if (pedido.getStatus() == StatusPedido.PENDENTE) {
                pedido.setStatus(StatusPedido.PAGO);
                pedido.setDataPagamento(LocalDateTime.now());
                pedidoRepository.save(pedido);

                System.out.println("✅ Pedido #" + pedidoId + " marcado como PAGO");
            } else {
                System.out.println("ℹ️ Pedido #" + pedidoId + " já estava no status: " + pedido.getStatus());
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao marcar pedido como pago: " + e.getMessage());
            throw new RuntimeException("Erro ao processar pagamento", e);
        }
    }

    public boolean verificarSePago(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        return pedido.getStatus() != StatusPedido.PENDENTE;
    }
}