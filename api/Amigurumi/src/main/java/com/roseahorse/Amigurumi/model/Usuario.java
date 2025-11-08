package com.roseahorse.Amigurumi.model;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalDate;

@Entity(name = "usuario")
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String cpf;
    private String endereco;
    private LocalDate dataNascimento;
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario = TipoUsuario.CLIENTE;

    @Column(name = "excluido", nullable = false)
    private Boolean excluido = false;


    public Usuario() {

    }

    public Usuario(String nome, String email, String senha, String telefone, String cpf, String endereco, LocalDate dataNascimento) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.cpf = cpf;
        this.endereco = endereco;
        this.dataNascimento = dataNascimento;
        this.excluido = false;
    }

    public TipoUsuario getTipoUsuario() { return tipoUsuario; }

    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Boolean getExcluido() { return excluido; }

    public void setExcluido(Boolean excluido) { this.excluido = excluido; }

    public void excluir() { this.excluido = true; }

    public void reativar() { this.excluido = false; }


    public boolean isAtivo() { return !this.excluido; }
}
