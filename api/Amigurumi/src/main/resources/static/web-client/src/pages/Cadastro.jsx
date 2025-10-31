// api/Amigurumi/src/main/resources/static/web-client/src/pages/Cadastro.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles.css";
// import "../js/main.js"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


export default function Cadastro() {
const API_URL = `${CORS_ORIGINS}`;

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          dataNascimento: formData.dataNascimento,
          telefone: formData.telefone,
          endereco: formData.endereco,
          email: formData.email,
          senha: formData.senha,
        }),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login"; // Usar react-router depois
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
            id="cadastro-name"
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
            id="cadastro-CPF"
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
            id="cadastro-nascimento"
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
            id="cadastro-telefone"
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
            id="cadastro-endereco"
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
            id="cadastro-email"
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
            id="cadastro-senha"
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