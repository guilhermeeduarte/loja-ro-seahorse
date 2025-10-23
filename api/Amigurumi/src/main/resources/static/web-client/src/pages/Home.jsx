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
        <img className="entrega-img" src="/Assets/Imagens/Entrega.png.png" alt="Entrega" />
      </div>
      <div className={`banner-img ${activeIndex === 1 ? 'fade-in' : 'fade-out'}`}>
        <img className="personalizado-img" src="/Assets/Imagens/banner2.png" alt="Personalizados" />
      </div>
    </section>
  )
}

// Lista de produtos
export const produtos = [
  { categoria: "Mais vendidos", nome: "Harry Potter", img: "Imagens/Harry_Potter.jpg" },
  { categoria: "Mais vendidos", nome: "Pinguim", img: "Imagens/Pinguim.jpg" },
  { categoria: "Mais vendidos", nome: "Capuccino", img: "Imagens/Capuccino.jpg" },
  { categoria: "Mais vendidos", nome: "Abacate", img: "Imagens/Abacate.jpg" },

  { categoria: "Animais", nome: "Raposa", img: "Imagens/Raposa.jpg" },
  { categoria: "Animais", nome: "Elefante", img: "Imagens/Elefante.jpg" },
  { categoria: "Animais", nome: "Coelho", img: "Imagens/Coelho.jpeg" },

  { categoria: "Destaque", nome: "Hermione Granger", img: "Imagens/Hermione.jpg" },

  { categoria: "Comidas", nome: "Abacaxi", img: "Imagens/Abacaxi.jpg" },
  { categoria: "Comidas", nome: "Laranja", img: "Imagens/Laranja.jpg" },

  { categoria: "Personagens", nome: "Hermione Granger", img: "Imagens/Hermione.jpg" },
  { categoria: "Personagens", nome: "Harry Potter", img: "Imagens/Harry_Potter.jpg" },
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
          <img className="lupa" src="/Assets/Imagens/lupa.png" alt="Lupa" width="20" height="20" />
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
