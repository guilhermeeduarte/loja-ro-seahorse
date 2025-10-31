import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import SmartImage from '../components/SmartImage'
import { produtos as produtosLocal } from '../data/produtos'
import '../styles.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
        <img className="entrega-img" src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799374266105957/Entrega.png.png?ex=68feba94&is=68fd6914&hm=d1c5555ec2662d13a31ac9d0313d2f9e3641808ea64a22034e369f0de8e57f4b&" alt="Entrega" />
      </div>

    </section>
  )
}

// Lista de produtos local (fallback) é importada de src/data/produtos.js

export default function Home() {
  const [termo, setTermo] = useState("")
  const [resultados, setResultados] = useState([])
  const [pesquisando, setPesquisando] = useState(false)
  const [produtos, setProdutos] = useState([])
  // se por algum motivo `produtos` estiver vazio, usar fallback local para renderização
  const displayProdutos = (produtos && produtos.length > 0) ? produtos : produtosLocal

  const handlePesquisa = (e) => {
    e.preventDefault()
    const termoLower = termo.trim().toLowerCase()
    setPesquisando(true)

    if (!termoLower) {
      setResultados([])
      return
    }

    const encontrados = displayProdutos.filter(
      (p) =>
        (p.nome || '').toLowerCase().includes(termoLower) ||
        (p.categoria || '').toLowerCase().includes(termoLower)
    )

    setResultados(encontrados)
  }

  useEffect(() => {
    let mounted = true
    // Tenta carregar do backend; se falhar, usa fallback local
    fetch('/api/produto')
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`)
        return res.json()
      })
        .then((data) => {
          if (!mounted) return
          // Mapear campos do backend para o formato esperado pelo front
          const mapped = (data || []).map((p) => ({
            id: p.id,
            nome: p.nome,
            descricao: p.descricao,
            preco: p.valor != null ? p.valor.toFixed(2).replace('.', ',') : undefined,
            categoria: p.categoria,
            // manter qualquer img vindo do backend ou montar um path padrão a partir do nome
            img: p.img || `/assets/imagens/${(p.nome || '').replace(/\s+/g, '_')}.jpg`,
            detalhes: p.detalhes,
          }))
          if (!mapped || mapped.length === 0) {
            console.warn('Backend retornou 0 produtos — usando fallback local')
            setProdutos(produtosLocal)
            console.debug('Home: produtos set to fallback, length=', produtosLocal.length)
          } else {
            setProdutos(mapped)
            console.debug('Home: produtos carregados do backend, length=', mapped.length)
          }
        })
      .catch((err) => {
        console.warn('Não foi possível carregar produtos do backend, usando fallback local:', err)
        // usar fallback local pré-definido
        setProdutos(produtosLocal)
        console.debug('Home: produtos set to fallback in catch, length=', produtosLocal.length)
      })

    return () => { mounted = false }
  }, [])

  const handleVoltar = () => {
  setPesquisando(false)
  setTermo("")
  setResultados([])
}

  const renderGrid = (items) => (
    <div className="grid">
      {items.map((item, index) => (
        <div key={index} className="item">
          <Link to={`/produto/${(item.nome || '').toLowerCase().replace(/\s+/g, '-')}`}>
            <SmartImage src={item.img} alt={item.nome} />
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
          <img className="lupa" src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799425495339029/lupa.png?ex=68febaa0&is=68fd6920&hm=850c15e585c1e4f32bc4da94a5417dbae6f89dbbb83ec241cf6582e53561fd0d&" alt="Lupa" width="20" height="20" />
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
                {renderGrid(displayProdutos.filter((p) => p.categoria === "Mais vendidos"))}
              </section>

              <section className="secao-conteudo" id="Animais">
                <h3 className="section-title">Animais! 🐾</h3>
                {renderGrid(displayProdutos.filter((p) => p.categoria === "Animais"))}
              </section>

              <section className="secao-conteudo" id="Destaque">
                <h3 className="section-title">Destaque! 🥇</h3>
                {renderGrid(displayProdutos.filter((p) => p.categoria === "Destaque"))}
              </section>

              <section className="secao-conteudo" id="Comidas">
                <h3 className="section-title">Comidas! 🍔</h3>
                {renderGrid(displayProdutos.filter((p) => p.categoria === "Comidas"))}
              </section>

              <section className="secao-conteudo" id="Personagens">
                <h3 className="section-title">Personagens! 🧙‍♂️</h3>
                {renderGrid(displayProdutos.filter((p) => p.categoria === "Personagens"))}
              </section>

              <Whatsapp />
            </>
          )}
      </div>

      <Footer />
    </div>
  )
}
