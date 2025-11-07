import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import SmartImage from '../components/SmartImage'
import { produtos as produtosLocal } from '../data/produtos'
import '../styles.css'

const API_URL = `http://localhost:3000/api`

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
        <img className="entrega-img" src="/assets/imagens/Entrega.png.png" alt="Entrega" />
      </div>
    </section>
  )
}

export default function Home() {
  const [termo, setTermo] = useState("")
  const [resultados, setResultados] = useState([])
  const [pesquisando, setPesquisando] = useState(false)
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function carregarProdutos() {
      try {
        const response = await fetch(`${API_URL}/produto`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (!mounted) return

        if (data && data.length > 0) {
          const produtosMapeados = data
            .filter(p => p.quantidade > 0)
            .map(p => ({
              id: p.id,
              nome: p.nome,
              descricao: p.descricao,
              preco: p.valor ? p.valor.toFixed(2).replace('.', ',') : '0,00',
              categoria: p.categoria || 'Destaque',
              // ✅ Usa a imagem do backend se existir
              img: p.imagemUrl || `/assets/imagens/boneco.jpg`,
              detalhes: p.detalhes,
              quantidade: p.quantidade
            }))

          setProdutos(produtosMapeados)
        } else {
          setProdutos(produtosLocal)
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
        if (mounted) {
          setProdutos(produtosLocal)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    carregarProdutos()

    return () => {
      mounted = false
    }
  }, [])

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
        (p.nome || '').toLowerCase().includes(termoLower) ||
        (p.categoria || '').toLowerCase().includes(termoLower) ||
        (p.descricao || '').toLowerCase().includes(termoLower)
    )

    setResultados(encontrados)
  }

  const handleVoltar = () => {
    setPesquisando(false)
    setTermo("")
    setResultados([])
  }

  const renderGrid = (items) => {
    if (!items || items.length === 0) {
      return <p style={{ textAlign: 'center', color: '#666' }}>Nenhum produto nesta categoria ainda.</p>
    }

    return (
      <div className="grid">
        {items.map((item, index) => (
          <div key={item.id || index} className="item">
            <Link to={`/produto/${(item.nome || '').toLowerCase().replace(/\s+/g, '-')}`}>
              {/* ✅ Renderiza a imagem correta */}
              <SmartImage src={item.img} alt={item.nome} />
              <p>{item.nome}</p>
              <h6>R$ {item.preco}</h6>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  const getProdutosPorCategoria = (categoria) => {
    return produtos.filter(p => p.categoria === categoria)
  }

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
          Carregando produtos...
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pagina">
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
          <img className="lupa" src="/assets/imagens/lupa.png" alt="Lupa" width="20" height="20" />
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
            : <p style={{ textAlign: 'center', padding: '20px' }}>Nenhum resultado encontrado para "{termo}".</p>
          : (
            <>
              <Banner />
              <section className="secao-conteudo" id="MaisVendidos">
                <h3 className="section-title">Mais vendidos! ⭐</h3>
                {renderGrid(getProdutosPorCategoria("Mais vendidos"))}
              </section>

              <section className="secao-conteudo" id="Animais">
                <h3 className="section-title">Animais! 🐾</h3>
                {renderGrid(getProdutosPorCategoria("Animais"))}
              </section>

              <section className="secao-conteudo" id="Destaque">
                <h3 className="section-title">Destaque! 🥇</h3>
                {renderGrid(getProdutosPorCategoria("Destaque"))}
              </section>

              <section className="secao-conteudo" id="Comidas">
                <h3 className="section-title">Comidas! 🍔</h3>
                {renderGrid(getProdutosPorCategoria("Comidas"))}
              </section>

              <section className="secao-conteudo" id="Personagens">
                <h3 className="section-title">Personagens! 🧙‍♂️</h3>
                {renderGrid(getProdutosPorCategoria("Personagens"))}
              </section>

              <Whatsapp />
            </>
          )}
      </div>

      <Footer />
    </div>
  )
}