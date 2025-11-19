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
    private String imagemUrl;

    @Column(name = "imagem_url_2")
    private String imagemUrl2;

    @Column(name = "imagem_url_3")
    private String imagemUrl3;

    @Column(name = "excluido", nullable = false)
    private Boolean excluido = false;

    public Produto() {
    }

    public Produto(String nome, String descricao, Double valor, Integer estoque, String categoria, String imagemUrl) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.quantidade = estoque;
        this.categoria = categoria;
        this.imagemUrl = imagemUrl;
        this.excluido = false;
    }

    // Getters e Setters

    public long getId() {
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

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getImagemUrl2() {
        return imagemUrl2;
    }

    public void setImagemUrl2(String imagemUrl2) {
        this.imagemUrl2 = imagemUrl2;
    }

    public String getImagemUrl3() {
        return imagemUrl3;
    }

    public void setImagemUrl3(String imagemUrl3) {
        this.imagemUrl3 = imagemUrl3;
    }

    public Boolean getExcluido() {
        return excluido;
    }

    public void setExcluido(Boolean excluido) {
        this.excluido = excluido;
    }

    public void excluir() {
        this.excluido = true;
    }

    public void reativar() {
        this.excluido = false;
    }

    public boolean isAtivo() {
        return !this.excluido;
    }

    public boolean isDisponivel() {
        return !this.excluido && this.quantidade > 0;
    }
}