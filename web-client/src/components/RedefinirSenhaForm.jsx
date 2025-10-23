import React, { useState } from "react";

const RedefinirSenhaForm = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!novaSenha || !confirmaSenha) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    // Aqui poderia ir a chamada de API para redefinir senha
    setMensagem("Senha redefinida com sucesso!");
  };

  return (
    <form id="redefinirForm" onSubmit={handleSubmit} className="form-redefinir">
      <div className="email-cadastro">
        <input
          type="password"
          className="form-control"
          id="nova-senha"
          placeholder="Insira nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          id="confirma-senha"
          placeholder="Confirme nova senha"
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
        />
      </div>

      <br />

      <button type="submit" className="botao">
        Confirmar
      </button>

      {mensagem && <p style={{ color: "red", marginTop: "10px" }}>{mensagem}</p>}
    </form>
  );
};

export default RedefinirSenhaForm;
