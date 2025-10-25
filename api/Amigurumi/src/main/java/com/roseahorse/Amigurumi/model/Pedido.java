package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    private Double valorTotal;

    @Column(name = "endereco")
    private String enderecoEntrega;


    private String formaPagamento;
    private LocalDateTime dataCancelamento;
    private LocalDateTime dataEntrega;


    public Pedido() {
        this.status = StatusPedido.PENDENTE;
    }

    public void calcularTotal() {
        this.valorTotal = itens.stream()
                .mapToDouble(ItemPedido::getSubtotal)
                .sum();
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public Long getId() {
        return id;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }
    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
        calcularTotal();
    }


    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public void marcarComoPago() {
        if (status != StatusPedido.PENDENTE) {
            throw new IllegalStateException("Somente pedidos pendentes podem ser pagos.");
        }
        this.status = StatusPedido.PAGO;
    }


    public void iniciarPreparo() {
        if (status != StatusPedido.PAGO) {
            throw new IllegalStateException("Somente pedidos pagos podem entrar em preparo.");
        }
        this.status = StatusPedido.EM_PREPARO;
    }


    public void marcarComoEnviado() {
        if (status != StatusPedido.EM_PREPARO) {
            throw new IllegalStateException("Somente pedidos em preparo podem ser enviados.");
        }
        this.status = StatusPedido.ENVIADO;
    }


    public void marcarComoEntregue() {
        if (status != StatusPedido.ENVIADO) {
            throw new IllegalStateException("Somente pedidos enviados podem ser marcados como entregues.");
        }
        this.status = StatusPedido.ENTREGUE;
        this.dataEntrega = LocalDateTime.now();
    }


    public void cancelarPedido() {
        if (status == StatusPedido.ENTREGUE) {
            throw new IllegalStateException("Não pode ser cancelado.");
        }
        this.status = StatusPedido.CANCELADO;
        this.dataCancelamento = LocalDateTime.now();
    }

    public LocalDateTime getDataEntrega() {
        return dataEntrega;
    }

    public LocalDateTime getDataCancelamento() {
        return dataCancelamento;
    }
}
