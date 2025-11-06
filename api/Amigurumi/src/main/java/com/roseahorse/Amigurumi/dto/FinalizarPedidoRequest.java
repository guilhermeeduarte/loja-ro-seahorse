package com.roseahorse.Amigurumi.dto;

public class FinalizarPedidoRequest {
    private String enderecoEntrega;
    private String formaPagamento;

    public FinalizarPedidoRequest() {}

    public FinalizarPedidoRequest(String enderecoEntrega, String formaPagamento) {
        this.enderecoEntrega = enderecoEntrega;
        this.formaPagamento = formaPagamento;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}
