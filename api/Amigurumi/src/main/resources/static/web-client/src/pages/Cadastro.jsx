import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles.css"; // ajuste o caminho conforme a localização do seu CSS

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    telefone: "",
    endereco: "",
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    // Aqui você pode adicionar lógica de envio para API
    alert("Cadastro enviado!");
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
            name="nascimento"
            value={formData.nascimento}
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
