package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;

@Entity(name = "produto")
@Table(name = "produto")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private Double valor;
    private Integer quantidade;
    private String categoria;

    public Produto() {

    }

    public Produto(String nome, String descricao, Double valor, Integer estoque, String categoria) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.quantidade = estoque;
        this.categoria = categoria;
    }

    public long getId () {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Integer getQuantidade() { return quantidade; }

    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

}
