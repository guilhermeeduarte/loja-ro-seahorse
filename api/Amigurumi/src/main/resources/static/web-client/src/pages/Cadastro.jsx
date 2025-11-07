import React, { useState } from "react";
import { cpf } from "cpf-cnpj-validator";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Cadastro() {
  const API_URL = `http://localhost:3000/api`;

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    endereco: "",
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Máscara manual para CPF
    if (name === "cpf") {
      const raw = value.replace(/\D/g, "").slice(0, 11);
      const masked = raw
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      setFormData((prev) => ({ ...prev, cpf: masked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (!cpf.isValid(cpfLimpo)) {
      alert("CPF inválido! Verifique os números digitados.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: formData.nome,
          cpf: cpfLimpo,
          dataNascimento: formData.dataNascimento,
          telefone: formData.telefone,
          endereco: formData.endereco,
          email: formData.email,
          senha: formData.senha,
        }),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login";
      } else {
        const erro = await response.text();
        alert("Erro no cadastro: " + erro);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Área de Cadastro</h1>
      </section>

      <form id="cadastro-form" onSubmit={handleSubmit}>
        <div className="nome-cadastro">
          <input
            type="text"
            className="form-control"
            name="nome"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="CPF-cadastro">
          <input
            type="text"
            className="form-control"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </div>

        <div className="nascimento-cadastro">
          <input
            type="date"
            className="form-control"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="telefone-cadastro">
          <input
            type="text"
            className="form-control"
            name="telefone"
            placeholder="Número de Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="endereco-cadastro">
          <input
            type="text"
            className="form-control"
            name="endereco"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
        </div>

        <div className="email-cadastro">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Endereço de Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="senha-cadastro">
          <input
            type="password"
            className="form-control"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="botao">
          Cadastrar
        </button>
      </form>

      <Footer />
    </div>
  );
}
