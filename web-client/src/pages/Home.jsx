import { Helmet } from "react-helmet";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css";

const produtos = [
  { categoria: "Mais vendidos", nome: "Harry Potter", img: "Assets/Imagens/Harry_Potter.jpg" },
  { categoria: "Mais vendidos", nome: "Pinguim", img: "Assets/Imagens/Pinguim.jpg" },
  { categoria: "Mais vendidos", nome: "Capuccino", img: "Assets/Imagens/Capuccino.jpg" },
  { categoria: "Mais vendidos", nome: "Abacate", img: "Assets/Imagens/Abacate.jpg" },

  { categoria: "Animais", nome: "Raposa", img: "Assets/Imagens/Raposa.jpg" },
  { categoria: "Animais", nome: "Pinguim", img: "Assets/Imagens/Pinguim.jpg" },
  { categoria: "Animais", nome: "Elefante", img: "Assets/Imagens/Elefante.jpg" },
  { categoria: "Animais", nome: "Coelho", img: "Assets/Imagens/Coelho.jpeg" },

  { categoria: "Destaque", nome: "Hermione Granger", img: "Assets/Imagens/Hermione.jpg" },

  { categoria: "Comidas", nome: "Abacaxi", img: "Assets/Imagens/Abacaxi.jpg" },
  { categoria: "Comidas", nome: "Laranja", img: "Assets/Imagens/Laranja.jpg" },
  { categoria: "Comidas", nome: "Abacate", img: "Assets/Imagens/Abacate.jpg" },

  { categoria: "Personagens", nome: "Hermione Granger", img: "Assets/Imagens/Hermione.jpg" },
  { categoria: "Personagens", nome: "Harry Potter", img: "Assets/Imagens/Harry_Potter.jpg" },
];

export default function Home() {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [pesquisando, setPesquisando] = useState(false);

  const handlePesquisa = (e) => {
    e.preventDefault();
    const termoLower = termo.trim().toLowerCase();
    setPesquisando(true);

    if (!termoLower) {
      setResultados([]);
      return;
    }

    const encontrados = produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoLower) ||
        p.categoria.toLowerCase().includes(termoLower)
    );

    setResultados(encontrados);
  };

  const handleVoltar = () => {
    setPesquisando(false);
    setTermo("");
    setResultados([]);
  };

  const renderGrid = (items) => (
    <div className="grid">
      {items.map((item, index) => (
        <div key={index} className="item">
          <img src={item.img} alt={item.nome} />
          <p>{item.nome}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pagina">
        <Helmet>
        <title>SeaHorse - Home</title>
        </Helmet>
        
      <Navbar />

      <nav className="menu-teleporte" style={{ display: pesquisando ? "none" : "flex" }}>
        <a href="#Animais" className="botao-teleporte">Animais</a>
        <a href="#Personagens" className="botao-teleporte">Personagens</a>
        <a href="#Comidas" className="botao-teleporte">Comidas</a>
      </nav>

      <form className="barra-pesquisa" onSubmit={handlePesquisa}>
        <input
          type="search"
          placeholder="Digite aqui"
          className="barra-digitar"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <button className="botao-pesquisa" type="submit">
          <img className="lupa" src="Assets/Imagens/lupa.png" alt="Lupa" width="20px" height="20px" />
        </button>
      </form>

      {pesquisando && (
        <button id="botao-voltar" onClick={handleVoltar}>
          Voltar para Home
        </button>
      )}

      <div id="resultados-pesquisa">
        {pesquisando ? (
          resultados.length > 0 ? (
            renderGrid(resultados)
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )
        ) : (
          <>
            <section className="banner">
              <div className="banner-img">
                <img className="entrega-img" src="Assets/Imagens/Entrega.png.png" alt="Entrega" />
              </div>
            </section>
 
            <section className="secao-conteudo" id="MaisVendidos" marginTop="20px">
              <h3 className="section-title">Mais vendidos! ⭐</h3>
              {renderGrid(produtos.filter((p) => p.categoria === "Mais vendidos"))}
            </section>

            <section className="secao-conteudo" id="Animais">
              <h3 className="section-title">Animais! 🐾</h3>
              {renderGrid(produtos.filter((p) => p.categoria === "Animais"))}
            </section>

            <section className="secao-conteudo" id="Destaque">
              <h3 className="section-title">Destaque! 🥇</h3>
              {renderGrid(produtos.filter((p) => p.categoria === "Destaque"))}
            </section>

            <section className="secao-conteudo" id="Comidas">
              <h3 className="section-title">Comidas! 🍔</h3>
              {renderGrid(produtos.filter((p) => p.categoria === "Comidas"))}
            </section>

            <section className="secao-conteudo" id="Personagens">
              <h3 className="section-title">Personagens! 🧙‍♂️</h3>
              {renderGrid(produtos.filter((p) => p.categoria === "Personagens"))}
            </section>

            <a href="https://wa.me/5599999999999" className="whatsapp-float" target="_blank">
              <img src="Assets/Imagens/whatsapp.png" alt="WhatsApp" />
            </a>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
