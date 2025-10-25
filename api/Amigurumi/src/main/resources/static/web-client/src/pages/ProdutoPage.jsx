import React from "react";
import { useParams } from "react-router-dom";
import ProdutoDetalhe from "../components/ProdutoDetalhe";

const produtos = [
  { nome: "Harry Potter", img: "Imagens/Harry_Potter.jpg", preco: "89,90", descricao: "Livro mágico", categoria: "Mais vendidos" },
  { nome: "Pinguim", img: "Imagens/Pinguim.jpg", preco: "57,90", descricao: "Pelúcia fofa", categoria: "Mais vendidos" },
  { nome: "Capuccino", img: "Imagens/Capuccino.jpg", preco: "29,90", descricao: "Bebida quente", categoria: "Mais vendidos" },
  { nome: "Abacate", img: "Imagens/Abacate.jpg", preco: "12,90", descricao: "Fruta saudável", categoria: "Mais vendidos" },
  { nome: "Raposa", img: "Imagens/Raposa.jpg", preco: "64,90", descricao: "Pelúcia esperta", categoria: "Animais" },
  { nome: "Elefante", img: "Imagens/Elefante.jpg", preco: "74,90", descricao: "Pelúcia gigante", categoria: "Animais" },
];

const ProdutoPage = () => {
  const { produtoNome } = useParams();
  const produto = produtos.find(
    (p) => p.nome.toLowerCase() === decodeURIComponent(produtoNome).toLowerCase()
  );

  return <ProdutoDetalhe produto={produto} />;
};

export default ProdutoPage;
