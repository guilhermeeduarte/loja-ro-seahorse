document.addEventListener("DOMContentLoaded", () => {
//cadastro
  const form = document.getElementById("cadastro-form");
  if (form) {
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
  }


  //login
    const loginForm = document.getElementById("loginForm");
      if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const email = document.getElementById("login-email").value;
          const senha = document.getElementById("login-senha").value;

          try {
            const response = await fetch("http://localhost:3000/api/usuario/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, senha })
            });

            if (response.ok) {
              const data = await response.json();
              localStorage.setItem("token", data.token); // salva token
              window.location.href = "home.html";       // redireciona
            } else {
              const errorMsg = await response.text();
              document.getElementById("mensagem").innerText = errorMsg;
            }
          } catch (err) {
            console.error(err);
            document.getElementById("mensagem").innerText = "Falha na requisição!";
          }
        });
      }

      //esqueci a senha
      const esqueciForm = document.getElementById("esqueciForm");
            if (esqueciForm) {
              esqueciForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const email = document.getElementById("esqueci-email").value;

                try {
                  const response = await fetch("http://localhost:3000/api/auth/esqueci-senha", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                  });

                  if (response.ok) {
                    const data = await response.json();
                    alert("Cadastro realizado com sucesso!");
                  } else {
                    const errorMsg = await response.text();
                    document.getElementById("mensagem").innerText = errorMsg;
                  }
                } catch (err) {
                  console.error(err);
                  document.getElementById("mensagem").innerText = "Erro na conexão";
                }
              });
            }
});
