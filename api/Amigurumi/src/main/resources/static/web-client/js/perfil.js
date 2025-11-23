import { API_URL } from '../src/config/api';


document.addEventListener("DOMContentLoaded", async () => {
  await carregarPerfil();
  configurarLogout();
});


async function carregarPerfil() {
  try {
    const response = await fetch(`${API_URL}/usuario/perfil`, {
      credentials: "include"
    });

    if (!response.ok) {

      alert("Você precisa estar logado para ver o perfil");
      window.location.href = "login.html";
      return;
    }

    const usuario = await response.json();
    exibirDadosUsuario(usuario);

  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
    alert("Erro ao carregar perfil. Tente novamente.");
  }
}


function exibirDadosUsuario(usuario) {

  document.getElementById("nome-usuario").textContent = usuario.nome;
  document.getElementById("email-usuario").textContent = usuario.email;
  document.getElementById("telefone-usuario").textContent = usuario.telefone || "Não informado";
  document.getElementById("cpf-usuario").textContent = formatarCPF(usuario.cpf);
  document.getElementById("endereco-usuario").textContent = usuario.endereco || "Não informado";
  document.getElementById("data-nascimento-usuario").textContent =
    formatarData(usuario.dataNascimento);


  const badge = document.getElementById("badge-tipo");
  const tipoUsuario = usuario.tipoUsuario;

  badge.textContent = tipoUsuario;
  badge.className = "badge-tipo badge-" + tipoUsuario.toLowerCase();


  if (tipoUsuario === "FUNCIONARIO" || tipoUsuario === "ADMINISTRADOR") {
    document.getElementById("area-funcionario").style.display = "block";
    document.getElementById("cargo-usuario").textContent =
      tipoUsuario === "ADMINISTRADOR" ? "Administrador do Sistema" : "Funcionário";
  }
}


window.editarPerfil = function() {

  document.getElementById("edit-nome").value =
    document.getElementById("nome-usuario").textContent;
  document.getElementById("edit-telefone").value =
    document.getElementById("telefone-usuario").textContent;
  document.getElementById("edit-endereco").value =
    document.getElementById("endereco-usuario").textContent;


  document.getElementById("modal-editar").style.display = "flex";
}

window.fecharModal = function() {
  document.getElementById("modal-editar").style.display = "none";
}


document.getElementById("form-editar-perfil").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("edit-nome").value,
    telefone: document.getElementById("edit-telefone").value,
    endereco: document.getElementById("edit-endereco").value
  };


  const senha = document.getElementById("edit-senha").value;
  if (senha) {
    dados.senha = senha;
  }

  try {
    const response = await fetch(`${API_URL}/usuario/perfil`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
      fecharModal();
      await carregarPerfil(); // Recarrega os dados
    } else {
      const erro = await response.text();
      alert("Erro ao atualizar: " + erro);
    }
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    alert("Erro ao conectar ao servidor");
  }
});

// 🚪 LOGOUT
function configurarLogout() {
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
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
}

window.verPedidos = function() {
  alert("Redirecionando para página de pedidos...");

}

window.gerenciarUsuarios = function() {
  alert("Redirecionando para gerenciamento de usuários...");

}

function formatarCPF(cpf) {
  if (!cpf) return "Não informado";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarData(data) {
  if (!data) return "Não informado";
  const date = new Date(data + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}

window.onclick = function(event) {
  const modal = document.getElementById("modal-editar");
  if (event.target === modal) {
    fecharModal();
  }
}