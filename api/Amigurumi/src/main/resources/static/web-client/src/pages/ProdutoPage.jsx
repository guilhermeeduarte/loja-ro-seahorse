// src/pages/ProdutoPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ProdutoDetalhe from "../components/ProdutoDetalhe";

const produtos = [
  { nome: "Harry Potter", img: "Assets/Imagens/Harry_Potter.jpg", categoria: "Mais vendidos" },
  { nome: "Pinguim", img: "Assets/Imagens/Pinguim.jpg", categoria: "Mais vendidos" },
  { nome: "Capuccino", img: "Assets/Imagens/Capuccino.jpg", categoria: "Mais vendidos" },
  { nome: "Abacate", img: "Assets/Imagens/Abacate.jpg", categoria: "Mais vendidos" },
  { nome: "Raposa", img: "Assets/Imagens/Raposa.jpg", categoria: "Animais" },
  { nome: "Elefante", img: "Assets/Imagens/Elefante.jpg", categoria: "Animais" },
  // ...adicionar todos os produtos
];

const ProdutoPage = () => {
  const { produtoNome } = useParams();
  const produto = produtos.find(
    (p) => p.nome.toLowerCase() === decodeURIComponent(produtoNome).toLowerCase()
  );

  return <ProdutoDetalhe produto={produto} />;
};

export default ProdutoPage;
