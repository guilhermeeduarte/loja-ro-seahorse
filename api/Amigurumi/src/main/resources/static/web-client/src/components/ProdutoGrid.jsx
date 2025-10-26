import React from "react";
import { Link } from "react-router-dom";
import SmartImage from "./SmartImage";

export default function ProdutoGrid({ titulo, produtos }) {
  if (!produtos || produtos.length === 0) return null;

  return (
    <section className="secao-conteudo" id={titulo}>
      <h3 className="section-title">{titulo}</h3>
      <div className="grid">
        {produtos.map((item) => (
          <div key={item.id || item.nome} className="item">
            <Link to={`/produto/${item.nome.toLowerCase().replace(/\s+/g, "-")}`}>
              <SmartImage src={item.img} alt={item.nome} />
              <p>{item.nome}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
