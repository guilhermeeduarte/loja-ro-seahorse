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
    // Add a loading state
    setPerfil(prev => ({ ...prev, isLoading: true }));
    
    fetch(`/api/perfil/${perfilId}`)
      .then((res) => res.json())
      .then((data) => setPerfil({ ...data, isLoading: false }))
      .catch((err) => {
        console.error(err);
        setPerfil(prev => ({ ...prev, isLoading: false }));
      });
  }, [perfilId]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/perfil/${perfilId}`, {
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
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="nome"
          value={perfil.nome || ''}
          onChange={handleChange}
          placeholder={perfil.isLoading ? 'Carregando...' : 'Nome completo'}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="CPF-cadastro">
        <input
          type="text"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="cpf"
          value={perfil.cpf || ''}
          onChange={handleChange}
          placeholder={perfil.isLoading ? 'Carregando...' : '000.000.000-00'}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="nascimento-cadastro">
        <input
          type="date"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="nascimento"
          value={perfil.nascimento || ''}
          onChange={handleChange}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="telefone-cadastro">
        <input
          type="text"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="telefone"
          value={perfil.telefone || ''}
          onChange={handleChange}
          placeholder={perfil.isLoading ? 'Carregando...' : '+55 11 99999-9999'}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="endereco-cadastro">
        <input
          type="text"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="endereco"
          value={perfil.endereco || ''}
          onChange={handleChange}
          placeholder={perfil.isLoading ? 'Carregando...' : 'Rua, número - Bairro'}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="email-cadastro">
        <input
          type="email"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="email"
          value={perfil.email || ''}
          onChange={handleChange}
          placeholder={perfil.isLoading ? 'Carregando...' : 'Endereço de Email'}
          disabled={perfil.isLoading}
        />
      </div>

      <div className="senha-cadastro">
        <input
          type="password"
          className={`form-control ${perfil.isLoading ? 'loading' : ''}`}
          name="senha"
          value={perfil.senha || ''}
          onChange={handleChange}
          placeholder="********"
          disabled={perfil.isLoading}
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
