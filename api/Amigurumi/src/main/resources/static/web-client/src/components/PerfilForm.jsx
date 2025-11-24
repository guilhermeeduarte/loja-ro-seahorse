import React, { useState, useEffect } from "react";
import { API_URL } from '../config/api';

const PerfilForm = ({ perfilId }) => {
  const [perfil, setPerfil] = useState({
    nome: "",
    dataNascimento: "",
    telefone: "",
    endereco: "",
    email: "",
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
        
        // ✅ Formata a data corretamente para o input[type="date"]
        const dataFormatada = data.dataNascimento 
          ? data.dataNascimento.split('T')[0] // Extrai apenas YYYY-MM-DD
          : "";

        // ✅ Formata o telefone com máscara
        const telefoneFormatado = formatarTelefone(data.telefone || "");

        setPerfil({
          nome: data.nome || "",
          dataNascimento: dataFormatada,
          telefone: telefoneFormatado,
          endereco: data.endereco || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        alert("Erro ao carregar perfil: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [perfilId]);

  // ✅ Função para formatar telefone com máscara
  const formatarTelefone = (valor) => {
    if (!valor) return "";
    const raw = valor.replace(/\D/g, "").slice(0, 13);
    let masked = raw;

    if (raw.length > 2) {
      masked = `+${raw.slice(0, 2)} ${raw.slice(2)}`;
    }
    if (raw.length > 4) {
      masked = `+${raw.slice(0, 2)} (${raw.slice(2, 4)}) ${raw.slice(4)}`;
    }
    if (raw.length > 9) {
      masked = `+${raw.slice(0, 2)} (${raw.slice(2, 4)}) ${raw.slice(4, 9)}-${raw.slice(9)}`;
    }

    return masked;
  };

  // ✅ handleChange com máscara de telefone
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const masked = formatarTelefone(value);
      setPerfil((prev) => ({ ...prev, telefone: masked }));
    } else {
      setPerfil((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Monta o payload apenas com os campos que o backend aceita
      const payload = {
        nome: perfil.nome,
        telefone: perfil.telefone,
        endereco: perfil.endereco,
      };

      // ✅ Inclui senha apenas se preenchida
      const senhaInput = document.getElementById("edit-senha");
      if (senhaInput && senhaInput.value.trim()) {
        payload.senha = senhaInput.value;
      }

      console.log("📤 Enviando payload:", payload);

      const res = await fetch(`${API_URL}/usuario/perfil`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar perfil: ${errorText}`);
      }

      alert("✅ Perfil atualizado com sucesso!");
      setEditMode(false);

      // ✅ Limpa o campo de senha após salvar
      if (senhaInput) senhaInput.value = "";

    } catch (err) {
      console.error("❌ Erro ao salvar:", err);
      alert("Erro ao salvar alterações: " + err.message);
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
      localStorage.removeItem("tipoUsuario");

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
          value={perfil.nome}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "Nome completo"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Data de nascimento - SOMENTE LEITURA */}
      <div className="nascimento-cadastro">
        <input
          type="date"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="dataNascimento"
          value={perfil.dataNascimento}
          disabled={true}
          style={{ opacity: 0.6, cursor: "not-allowed" }}
          title="Data de nascimento não pode ser alterada"
        />
      </div>

      {/* Telefone */}
      <div className="telefone-cadastro">
        <input
          type="text"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="telefone"
          value={perfil.telefone}
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
          value={perfil.endereco}
          onChange={handleChange}
          placeholder={isLoading ? "Carregando..." : "Rua, número - Bairro"}
          disabled={!editMode || isLoading}
        />
      </div>

      {/* Email - SOMENTE LEITURA */}
      <div className="email-cadastro">
        <input
          type="email"
          className={`form-control ${isLoading ? "loading" : ""}`}
          name="email"
          value={perfil.email}
          disabled={true}
          style={{ opacity: 0.6, cursor: "not-allowed" }}
          title="Email não pode ser alterado"
        />
      </div>

      {/* ✅ Senha (apenas no modo edição) */}
      {editMode && (
        <div className="senha-cadastro">
          <input
            type="password"
            className="form-control"
            id="edit-senha"
            placeholder="Nova senha (deixe vazio para não alterar)"
            disabled={isLoading}
          />
        </div>
      )}

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
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="botao"
              onClick={() => {
                setEditMode(false);
                const senhaInput = document.getElementById("edit-senha");
                if (senhaInput) senhaInput.value = "";
              }}
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
