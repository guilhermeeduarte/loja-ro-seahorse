import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || senha.trim() === "") {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    // Aqui entraria a lógica real de login (API, autenticação etc.)
    if (email === "teste@teste.com" && senha === "123456") {
      setMensagem("Login realizado com sucesso!");
      alert("Bem-vindo!");
    } else {
      setMensagem("E-mail ou senha incorretos.");
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
