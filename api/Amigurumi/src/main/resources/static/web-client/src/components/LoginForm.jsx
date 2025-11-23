import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from '../config/api';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Tentando fazer login...");

    if (email.trim() === "" || senha.trim() === "") {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setMensagem("Conectando ao servidor...");
      console.log("Enviando requisição para:", "/usuario/login");

      const response = await fetch(`${API_URL}/usuario/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
        credentials: 'include' // Importante para o cookie ser salvo
      });

      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Dados recebidos:", data);

      if (!response.ok) {
        setMensagem(typeof data === 'string' ? data : "Erro ao fazer login");
        return;
      }

        localStorage.setItem("usuarioLogado", "true");
        localStorage.setItem("tipoUsuario", data.tipoUsuario);

        navigate("/");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem("Erro ao conectar com o servidor");
    }
    localStorage.setItem("usuarioLogado", "true");

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
