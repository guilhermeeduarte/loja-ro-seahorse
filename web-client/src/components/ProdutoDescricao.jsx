import React from "react";

const ProdutoDescricao = ({ titulo, detalhes }) => {
  return (
    <div className="descricao">
      <h2 style={{ fontWeight: "bold" }}>{titulo}</h2>
      {detalhes.map((texto, i) => (
        <p key={i}>{texto}</p>
      ))}
    </div>
  );
};

export default ProdutoDescricao;
