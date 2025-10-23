import React, { useState, useEffect } from "react";

const PerfilForm = ({ perfilId }) => {
  const [perfil, setPerfil] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    telefone: "",
    endereco: "",
    email: "",
    senha: "",
  });

  // Carrega perfil ao montar o componente
  useEffect(() => {
    fetch(`http://localhost:5000/perfil/${perfilId}`)
      .then((res) => res.json())
      .then((data) => setPerfil(data))
      .catch((err) => console.error(err));
  }, [perfilId]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/perfil/${perfilId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(perfil),
    })
      .then((res) => res.json())
      .then(() => alert("Perfil atualizado com sucesso!"))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="nome-cadastro">
        <input
          type="text"
          className="form-control"
          name="nome"
          value={perfil.nome}
          onChange={handleChange}
          placeholder="Nome completo"
        />
      </div>

      <div className="CPF-cadastro">
        <input
          type="text"
          className="form-control"
          name="cpf"
          value={perfil.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
        />
      </div>

      <div className="nascimento-cadastro">
        <input
          type="date"
          className="form-control"
          name="nascimento"
          value={perfil.nascimento}
          onChange={handleChange}
        />
      </div>

      <div className="telefone-cadastro">
        <input
          type="text"
          className="form-control"
          name="telefone"
          value={perfil.telefone}
          onChange={handleChange}
          placeholder="+55 11 99999-9999"
        />
      </div>

      <div className="endereco-cadastro">
        <input
          type="text"
          className="form-control"
          name="endereco"
          value={perfil.endereco}
          onChange={handleChange}
          placeholder="Rua, número - Bairro"
        />
      </div>

      <div className="email-cadastro">
        <input
          type="email"
          className="form-control"
          name="email"
          value={perfil.email}
          onChange={handleChange}
          placeholder="Endereço de Email"
        />
      </div>

      <div className="senha-cadastro">
        <input
          type="password"
          className="form-control"
          name="senha"
          value={perfil.senha}
          onChange={handleChange}
          placeholder="********"
        />
      </div>

      {/* Mantendo a mesma estilização dos botões */}
      <div className="botaos">
        <button type="submit" className="botao">
          Editar
        </button>
        <button
          type="button"
          className="botao"
          onClick={() => alert("Logout ainda não implementado")}
        >
          Logout
        </button>
      </div>
    </form>
  );
};

export default PerfilForm;
