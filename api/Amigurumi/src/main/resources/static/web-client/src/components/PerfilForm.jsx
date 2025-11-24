import React, { useState, useEffect } from "react";
import { API_URL } from '../config/api';

const PerfilForm = ({ perfilId }) => {
  const [perfil, setPerfil] = useState({
    nome: "",
    nascimento: "",
    telefone: "",
    endereco: "",
    email: "",
    senha: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Carrega o perfil ao montar o componente
  useEffect(() => {
    const carregarPerfil = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/usuario/perfil`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text}`);
        }

        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar perfil");
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [perfilId]);

  // ✅ handleChange com máscara de telefone
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const raw = value.replace(/\D/g, "").slice(0, 13); // só números, até 13 dígitos
      let masked = raw;

      // Formata como +55 (11) 99999-9999
      if (raw.length > 2) {
        masked = `+${raw.slice(0, 2)} ${raw.slice(2)}`;
      }
      if (raw.length > 4) {
        masked = `+${raw.slice(0, 2)} (${raw.slice(2, 4)}) ${raw.slice(4)}`;
      }
      if (raw.length > 9) {
        masked = `+${raw.slice(0, 2)} (${raw.slice(2, 4)}) ${raw.slice(
          4,
          9
        )}-${raw.slice(9)}`;
      }

      setPerfil((prev) => ({ ...prev, telefone: masked }));
    } else {
      setPerfil((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuario/perfil`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        nome: perfil.nome,
        telefone: perfil.telefone,
        endereco: perfil.endereco,
        senha: perfil.senha, }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");
      alert("Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Função de Logout
  const handleLogout = async () => {
    if (!window.confirm("Deseja realmente sair?")) return;

    try {
      const res = await fetch(`${API_URL}/usuario/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao realizar logout");
      }

      const data = await res.json();
      console.log(data.mensagem || "Logout realizado");

      localStorage.removeItem("usuarioLogado");

      alert("Logout realizado com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar logout.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Nome */}
      <div className="nome-cadastro">
        <input
          type="text"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="nome"
          value={perfil.nome || ""}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "Nome completo"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Data de nascimento */}
      <div className="nascimento-cadastro">
        <input
          type="date"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="nascimento"
          value={perfil.nascimento || ""}
          onChange={handleChange}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Telefone */}
      <div className="telefone-cadastro">
        <input
          type="text"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="telefone"
          value={perfil.telefone || ""}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "+55 (11) 99999-9999"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Endereço */}
      <div className="endereco-cadastro">
        <input
          type="text"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="endereco"
          value={perfil.endereco || ""}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "Rua, número - Bairro"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Email */}
      <div className="email-cadastro">
        <input
          type="email"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="email"
          value={perfil.email || ""}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "Endereço de Email"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Botões */}
      <div className="botaos">
        {!editMode ? (
          <button
            type="button"
            className="botao"
            onClick={() => setEditMode(true)}
            disabled={isLoading}
          >
            Editar
          </button>
        ) : (
          <>
            <button type="submit" className="botao" disabled={isLoading}>
              Salvar
            </button>
            <button
              type="button"
              className="botao"
              onClick={() => setEditMode(false)}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </>
        )}

        <button
          type="button"
          className="botao"
          onClick={handleLogout}
          disabled={isLoading}
        >
          Logout
        </button>
      </div>
    </form>
  );
};

export default PerfilForm;
