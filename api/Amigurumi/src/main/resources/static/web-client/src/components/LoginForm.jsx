import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || senha.trim() === "") {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("/api/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data || "Erro ao fazer login");
        return;
      }

      // Redireciona com base no tipo de usuário
      switch (data.tipoUsuario) {
        case "ADMIN":
          navigate("/perfil-adm");
          break;
        case "CLIENTE":
          navigate("/perfil-cliente");
          break;
        default:
          navigate("/perfil-usuario");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem("Erro ao conectar com o servidor");
    }
  };

  return (
    <form id="loginForm" onSubmit={handleSubmit} className="form-login">
      <div className="email-login">
        <input
          type="email"
          className="form-control"
          id="login-email"
          placeholder="Endereço de Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="senha-cadastro">
        <input
          type="password"
          className="form-control"
          id="login-senha"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <div className="form-links">
        <div className="link-cadastro">
          <Link to="/cadastro">Cadastre-se!</Link>
        </div>

        <div className="link-esqueci">
          <Link to="/esqueci">Esqueci minha senha!</Link>
        </div>
      </div>

      <br />

      <button type="submit" className="botao">
        Entrar
      </button>

      {mensagem && <p id="mensagem" style={{ color: "red" }}>{mensagem}</p>}
    </form>
  );
};

export default LoginForm;
