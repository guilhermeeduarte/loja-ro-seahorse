const API_URL = "http://localhost:3000/api";


let formBusca;
let inputBusca;
let resultadosBusca;
let gridBusca;
let termoBusca;
let mensagemBusca;
let secoesNormais;


function inicializarBusca() {
  formBusca = document.getElementById("form-busca");
  inputBusca = document.getElementById("input-busca");
  resultadosBusca = document.getElementById("resultados-busca");
  gridBusca = document.getElementById("grid-busca");
  termoBusca = document.getElementById("termo-busca");
  mensagemBusca = document.getElementById("mensagem-busca");
  secoesNormais = document.getElementById("secoes-normais");

  if (formBusca) {

    formBusca.addEventListener("submit", async (e) => {
      e.preventDefault();
      await realizarBusca();
    });


    inputBusca.addEventListener("input", () => {
      if (inputBusca.value.trim() === "") {
        mostrarSecoesNormais();
      }
    });
  }
}


async function realizarBusca() {
  const termo = inputBusca.value.trim();


  if (!termo) {
    mostrarSecoesNormais();
    return;
  }


  if (termo.length < 2) {
    alert("Digite pelo menos 2 caracteres para buscar");
    return;
  }

  try {

    exibirLoading();

    const response = await fetch(
      `${API_URL}/produto/buscar?termo=${encodeURIComponent(termo)}`,
      {
        credentials: "include"
      }
    );

    if (response.ok) {
      const produtos = await response.json();
      exibirResultadosBusca(produtos, termo);
    } else {
      alert("Erro ao buscar produtos");
      console.error("Erro na busca:", response.status);
    }
  } catch (err) {
    console.error("Erro na busca:", err);
    alert("Não foi possível buscar os produtos. Verifique sua conexão.");
  } finally {
    esconderLoading();
  }
}


function exibirResultadosBusca(produtos, termo) {

  if (secoesNormais) secoesNormais.style.display = "none";


  if (resultadosBusca) resultadosBusca.style.display = "block";
  if (termoBusca) termoBusca.textContent = termo;


  if (gridBusca) gridBusca.innerHTML = "";

  if (produtos.length === 0) {

    if (mensagemBusca) mensagemBusca.style.display = "block";
    if (resultadosBusca) resultadosBusca.style.display = "none";
  } else {

    if (mensagemBusca) mensagemBusca.style.display = "none";

    produtos.forEach(produto => {
      const item = criarItemProduto(produto);
      if (gridBusca) gridBusca.appendChild(item);
    });
  }
}


function criarItemProduto(produto) {
  const item = document.createElement("div");
  item.className = "item";


  const precoFormatado = produto.valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  item.innerHTML = `
    <img src="Assets/Imagens/boneco.jpg" alt="${produto.nome}">
    <p>${produto.nome}</p>
    <h6>${precoFormatado}</h6>
    <button class="btn-comprar" onclick="adicionarAoCarrinho(${produto.id})">
      Comprar
    </button>
  `;

  return item;
}


function mostrarSecoesNormais() {
  if (secoesNormais) secoesNormais.style.display = "block";
  if (resultadosBusca) resultadosBusca.style.display = "none";
  if (mensagemBusca) mensagemBusca.style.display = "none";
  if (inputBusca) inputBusca.value = "";
}


function exibirLoading() {
  if (gridBusca) {
    gridBusca.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 40px;">
        <p style="font-size: 18px; color: #666;">
         Buscando produtos...
        </p>
      </div>
    `;
  }
  if (secoesNormais) secoesNormais.style.display = "none";
  if (resultadosBusca) resultadosBusca.style.display = "block";
  if (mensagemBusca) mensagemBusca.style.display = "none";
}


function esconderLoading() {

}


window.adicionarAoCarrinho = function(produtoId) {
  alert(`Produto ${produtoId} adicionado ao carrinho!`);
  // TODO: Implementar lógica real de carrinho
  console.log("Produto adicionado:", produtoId);
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarBusca);
} else {
  inicializarBusca();
}
