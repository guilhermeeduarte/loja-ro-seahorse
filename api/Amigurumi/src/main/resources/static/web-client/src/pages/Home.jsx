import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import '../styles.css'

// Banner fora do componente Home
const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? 1 : 0))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="banner">
      <div className={`banner-img ${activeIndex === 0 ? 'fade-in' : 'fade-out'}`}>
        <img className="entrega-img" src="https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Entrega.png.png" alt="Entrega" />
      </div>

    </section>
  )
}

// Lista de produtos
export const produtos = [
  { categoria: "Mais vendidos", nome: "Harry Potter", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Harry_Potter.jpg" },
  { categoria: "Mais vendidos", nome: "Pinguim", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Pinguim.jpeg" },
  { categoria: "Mais vendidos", nome: "Capuccino", img: "https://github.com/guilhermeeduarte/loja-ro-seahorse/blob/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Capuccino.jpg?raw=true" },
  { categoria: "Mais vendidos", nome: "Abacate", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Abacate.jpg "},

  { categoria: "Animais", nome: "Raposa", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Raposa.jpg" },
  { categoria: "Animais", nome: "Elefante", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Elefante.jpg" },
  { categoria: "Animais", nome: "Coelho", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Coelho.jpeg" },

  { categoria: "Destaque", nome: "Hermione Granger", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Hermione.jpg" },

  { categoria: "Comidas", nome: "Abacaxi", img: "https://github.com/guilhermeeduarte/loja-ro-seahorse/blob/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Abacaxi.jpg?raw=true" },
  { categoria: "Comidas", nome: "Laranja", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Laranja.jpg" },

  { categoria: "Personagens", nome: "Hermione Granger", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Hermione.jpg" },
  { categoria: "Personagens", nome: "Harry Potter", img: "https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/Harry_Potter.jpg" },
]; 

const handlePesquisa = (e) => {
  e.preventDefault()
  const termoLower = termo.trim().toLowerCase()
  setPesquisando(true)

  if (!termoLower) {
    setResultados([])
    return
  }

  const encontrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(termoLower) ||
      p.categoria.toLowerCase().includes(termoLower)
  )

  setResultados(encontrados)
}

export default function Home() {
  const [termo, setTermo] = useState("")
  const [resultados, setResultados] = useState([])
  const [pesquisando, setPesquisando] = useState(false)

  const handlePesquisa = (e) => {
  e.preventDefault()
  const termoLower = termo.trim().toLowerCase()
  setPesquisando(true)

  if (!termoLower) {
    setResultados([])
    return
  }

  const encontrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(termoLower) ||
      p.categoria.toLowerCase().includes(termoLower)
  )

  setResultados(encontrados)
}

  const handleVoltar = () => {
  setPesquisando(false)
  setTermo("")
  setResultados([])
}

  const renderGrid = (items) => (
    <div className="grid">
      {items.map((item, index) => (
        <div key={index} className="item">
          <Link to={`/produto/${encodeURIComponent(item.nome)}`}>
            <img src={`/Assets/${item.img}`} alt={item.nome} />
            <p>{item.nome}</p>
          </Link>
        </div>
      ))}
    </div>
  )

  return (
    <div className="pagina">
  
      <Navbar />

      <nav className="menu-teleporte" style={{ display: pesquisando ? "none" : "flex" }}>
        <a href="#Animais" className="botao-teleporte">Animais</a>
        <a href="#Personagens" className="botao-teleporte">Personagens</a>
        <a href="#Comidas" className="botao-teleporte">Comidas</a>
      </nav>

      <form className="barra-pesquisa" onSubmit={handlePesquisa}>
        <input type="search" placeholder="Digite aqui" className="barra-digitar" value={termo} onChange={(e) => setTermo(e.target.value)} />
        <button className="botao-pesquisa" type="submit">
          <img className="lupa" src="https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/lupa.png" alt="Lupa" width="20" height="20" />
        </button>
      </form>

      {pesquisando && (
        <button id="botao-voltar" onClick={handleVoltar}>
          Voltar para Home
        </button>
      )}

      <div id="resultados-pesquisa">
        {pesquisando
          ? resultados.length > 0
            ? renderGrid(resultados)
            : <p>Nenhum resultado encontrado.</p>
          : (
            <>
              <Banner />

              {/* Seções de produtos */}
              <section className="secao-conteudo" id="MaisVendidos">
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

              <Whatsapp />
            </>
          )}
      </div>

      <Footer />
    </div>
  )
}
