import React, { useState } from "react";

const EsqueciForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Por favor, preencha o e-mail.");
      return;
    }

    // Aqui você pode colocar a lógica real de envio (ex: API)
    alert(`Um link de redefinição foi enviado para ${email}.`);
    setEmail("");
  };

  return (
    <form id="esqueciForm" onSubmit={handleSubmit} className="form-esqueci">
      <div className="email-cadastro">
        <input
          type="email"
          className="form-control"
          id="esqueci-email"
          placeholder="Endereço de Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit" className="botao">
        Enviar
      </button>
    </form>
  );
};

export default EsqueciForm;
