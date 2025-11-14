package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;

@Entity(name = "devolucao_imagem")
@Table(name = "devolucao_imagem")
public class DevolucaoImagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "devolucao_id", nullable = false)
    private Devolucao devolucao;

    @Column(name = "imagem_url", nullable = false, length = 500)
    private String imagemUrl;

    public DevolucaoImagem() {
    }

    public DevolucaoImagem(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Devolucao getDevolucao() {
        return devolucao;
    }

    public void setDevolucao(Devolucao devolucao) {
        this.devolucao = devolucao;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
}