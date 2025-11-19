package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "endereco")
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 50)
    private String apelido;

    @Column(nullable = false, length = 10)
    private String cep;

    @Column(nullable = false, length = 50)
    private String pais = "Brasil";

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(nullable = false, length = 100)
    private String cidade;

    @Column(length = 100)
    private String bairro;

    @Column(nullable = false, length = 200)
    private String rua;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(length = 100)
    private String complemento;

    @Column(length = 500)
    private String observacoes;

    @Column(nullable = false)
    private Boolean principal = false;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    public Endereco() {
        this.dataCriacao = LocalDateTime.now();
    }

    // Método para formatar endereço completo
    public String getEnderecoCompleto() {
        StringBuilder sb = new StringBuilder();
        sb.append(rua).append(", ").append(numero);

        if (complemento != null && !complemento.trim().isEmpty()) {
            sb.append(" - ").append(complemento);
        }

        if (bairro != null && !bairro.trim().isEmpty()) {
            sb.append(" - ").append(bairro);
        }

        sb.append(" - ").append(cidade).append("/").append(estado);
        sb.append(", CEP: ").append(cep);

        if (observacoes != null && !observacoes.trim().isEmpty()) {
            sb.append(" | Obs: ").append(observacoes);
        }

        return sb.toString();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getApelido() {
        return apelido;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Boolean getPrincipal() {
        return principal;
    }

    public void setPrincipal(Boolean principal) {
        this.principal = principal;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}