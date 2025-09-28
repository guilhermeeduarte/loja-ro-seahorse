

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const usuario = {
      nome: document.getElementById("input-name").value,
      cpf: document.getElementById("input-CPF").value,
      dataNascimento: document.getElementById("input-nascimento").value,
      telefone: document.getElementById("input-telefone").value,
      endereco: document.getElementById("input-endereco").value,
      email: document.getElementById("input-email").value,
      senha: document.getElementById("input-senha").value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        form.reset();
      } else {
        const erro = await response.text();
        alert("Erro no cadastro: " + erro);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor.");
    }
  });
});
