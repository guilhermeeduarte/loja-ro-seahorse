document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api";

//cadastro
  const form = document.getElementById("cadastro-form");
   if (form) {
     form.addEventListener("submit", async (e) => {
       e.preventDefault();

       const usuario = {
         nome: document.getElementById("cadastro-name").value,
         cpf: document.getElementById("cadastro-CPF").value,
         dataNascimento: document.getElementById("cadastro-nascimento").value,
         telefone: document.getElementById("cadastro-telefone").value,
         endereco: document.getElementById("cadastro-endereco").value,
         email: document.getElementById("cadastro-email").value,
         senha: document.getElementById("cadastro-senha").value,
       };

       try {
         const response = await fetch(`${API_URL}/usuario`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           credentials: "include",
           body: JSON.stringify(usuario),
         });

         if (response.ok) {
           alert("Cadastro realizado com sucesso!");
           form.reset();
           window.location.href = "login.html";
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
           const response = await fetch(`${API_URL}/usuario/login`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             credentials: "include",
             body: JSON.stringify({ email, senha })
           });

           if (response.ok) {
             const data = await response.json();
             alert(`Bem-vindo, ${data.nome}!`);
             window.location.href = "home.html";
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

//logout(tem q adicionar ainda)
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`${API_URL}/usuario/logout`, {
          method: "POST",
          credentials: "include"
        });

        if (response.ok) {
          alert("Logout realizado com sucesso!");
          window.location.href = "login.html";
        }
      } catch (err) {
        console.error("Erro no logout:", err);
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
            const response = await fetch(`${API_URL}/auth/esqueci-senha`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email })
            });

            if (response.ok) {
              alert("Email enviado com sucesso! Verifique sua caixa de entrada.");
            } else {
              const errorMsg = await response.text();
              alert("Erro: " + errorMsg);
            }
          } catch (err) {
            console.error(err);
            alert("Erro na conexão");
          }
        });
      }
      const redefinirForm = document.getElementById("redefinirForm");
        if (redefinirForm) {
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');

          if (!token) {
            alert("Token inválido!");
            window.location.href = "login.html";
            return;
          }

          redefinirForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const novaSenha = document.getElementById("nova-senha").value;
            const confirmaSenha = document.getElementById("confirma-senha").value;

            if (novaSenha !== confirmaSenha) {
              alert("As senhas não coincidem!");
              return;
            }

            try {
              const response = await fetch(`${API_URL}/auth/redefinir-senha`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token, senha: novaSenha })
              });

              if (response.ok) {
                alert("Senha redefinida com sucesso!");
                window.location.href = "login.html";
              } else {
                const errorMsg = await response.text();
                alert("Erro: " + errorMsg);
              }
            } catch (err) {
              console.error(err);
              alert("Erro na conexão");
            }
          });
        }
});

document.addEventListener("DOMContentLoaded", () => {
  const perfilLink = document.getElementById("perfil");

  perfilLink.addEventListener("click", async (e) => {
    e.preventDefault(); // impede o redirecionamento imediato

    try {
      const res = await fetch("http://localhost:3000/api/usuario/me", {
        credentials: "include", // envia o cookie auth_token
      });

      if (res.ok) {
        // Usuário autenticado
        window.location.href = "/web-client/perfil.html";
      } else {
        // Não autenticado
        window.location.href = "/web-client/cadastro.html";
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      window.location.href = "/web-client/cadastro.html";
    }
  });
});
