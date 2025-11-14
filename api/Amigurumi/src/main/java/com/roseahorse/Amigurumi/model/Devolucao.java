package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "devolucao")
@Table(name = "devolucao")
public class Devolucao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String motivo;

    @Column(length = 1000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusDevolucao status = StatusDevolucao.PENDENTE;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "data_aprovacao")
    private LocalDateTime dataAprovacao;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(name = "observacoes_admin", length = 1000)
    private String observacoesAdmin;

    @OneToMany(mappedBy = "devolucao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DevolucaoImagem> imagens = new ArrayList<>();

    public Devolucao() {
        this.dataSolicitacao = LocalDateTime.now();
    }

    public Devolucao(Pedido pedido, Usuario usuario, String motivo, String descricao) {
        this();
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo;
        this.descricao = descricao;
    }

    // Métodos auxiliares
    public void aprovar(String observacoes) {
        this.status = StatusDevolucao.APROVADA;
        this.dataAprovacao = LocalDateTime.now();
        this.observacoesAdmin = observacoes;
    }

    public void rejeitar(String observacoes) {
        this.status = StatusDevolucao.REJEITADA;
        this.observacoesAdmin = observacoes;
    }

    public void concluir() {
        this.status = StatusDevolucao.CONCLUIDA;
        this.dataConclusao = LocalDateTime.now();
    }

    public void adicionarImagem(DevolucaoImagem imagem) {
        imagens.add(imagem);
        imagem.setDevolucao(this);
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public StatusDevolucao getStatus() {
        return status;
    }

    public void setStatus(StatusDevolucao status) {
        this.status = status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDateTime dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }

    public LocalDateTime getDataAprovacao() {
        return dataAprovacao;
    }

    public void setDataAprovacao(LocalDateTime dataAprovacao) {
        this.dataAprovacao = dataAprovacao;
    }

    public LocalDateTime getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(LocalDateTime dataConclusao) {
        this.dataConclusao = dataConclusao;
    }

    public String getObservacoesAdmin() {
        return observacoesAdmin;
    }

    public void setObservacoesAdmin(String observacoesAdmin) {
        this.observacoesAdmin = observacoesAdmin;
    }

    public List<DevolucaoImagem> getImagens() {
        return imagens;
    }

    public void setImagens(List<DevolucaoImagem> imagens) {
        this.imagens = imagens;
    }
}