import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import '../styles.css'

const API_URL = import React, { useState, useEffect } from 'react'
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
                        <img className="entrega-img" src="/assets/Imagens/Entrega.png.png" alt="Entrega" />
                      </div>
                      <div className={`banner-img ${activeIndex === 1 ? 'fade-in' : 'fade-out'}`}>
                        <img className="personalizado-img" src="/Assets/Imagens/banner2.png" alt="Personalizados" />
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

                  // Carregar produtos do backend
                  useEffect(() => {
                    carregarProdutos()
                  }, [])

                  const carregarProdutos = async () => {
                    try {
                      setLoading(true)
                      const response = await fetch(`${API_URL}/produto`, {
                        credentials: 'include'
                      })

                      if (response.ok) {
                        const data = await response.json()
                        setProdutos(data)
                      } else {
                        console.error('Erro ao carregar produtos')
                      }
                    } catch (error) {
                      console.error('Erro ao conectar com o servidor:', error)
                    } finally {
                      setLoading(false)
                    }
                  }

                  const handlePesquisa = async (e) => {
                    e.preventDefault()
                    const termoLower = termo.trim().toLowerCase()
                    setPesquisando(true)

                    if (!termoLower) {
                      setResultados([])
                      return
                    }

                    try {
                      const response = await fetch(
                        `${API_URL}/produto/buscar?termo=${encodeURIComponent(termoLower)}`,
                        {
                          credentials: 'include'
                        }
                      )

                      if (response.ok) {
                        const data = await response.json()
                        setResultados(data)
                      }
                    } catch (error) {
                      console.error('Erro na busca:', error)
                    }
                  }

                  const handleVoltar = () => {
                    setPesquisando(false)
                    setTermo("")
                    setResultados([])
                  }

                  const renderGrid = (items) => (
                    <div className="grid">
                      {items.map((item) => (
                        <div key={item.id} className="item">
                          <Link to={`/produto/${encodeURIComponent(item.nome)}`}>
                            <img
                              src="/Assets/Imagens/boneco.jpg"
                              alt={item.nome}
                              onError={(e) => {
                                e.target.src = '/Assets/Imagens/boneco.jpg'
                              }}
                            />
                            <p>{item.nome}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )

                  const produtosPorCategoria = (categoria) => {
                    return produtos.filter(p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase())
                  }

                  if (loading) {
                    return (
                      <div className="pagina">
                        <Navbar />
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                          <p>Carregando produtos...</p>
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
                            : <p style={{ textAlign: 'center' }}>Nenhum resultado encontrado.</p>
                          : (
                            <>
                              <Banner />

                              {produtosPorCategoria('Mais vendidos').length > 0 && (
                                <section className="secao-conteudo" id="MaisVendidos">
                                  <h3 className="section-title">Mais vendidos! ⭐</h3>
                                  {renderGrid(produtosPorCategoria('Mais vendidos'))}
                                </section>
                              )}

                              {produtosPorCategoria('Animais').length > 0 && (
                                <section className="secao-conteudo" id="Animais">
                                  <h3 className="section-title">Animais! 🐾</h3>
                                  {renderGrid(produtosPorCategoria('Animais'))}
                                </section>
                              )}

                              {produtosPorCategoria('Destaque').length > 0 && (
                                <section className="secao-conteudo" id="Destaque">
                                  <h3 className="section-title">Destaque! 🥇</h3>
                                  {renderGrid(produtosPorCategoria('Destaque'))}
                                </section>
                              )}

                              {produtosPorCategoria('Comidas').length > 0 && (
                                <section className="secao-conteudo" id="Comidas">
                                  <h3 className="section-title">Comidas! 🍔</h3>
                                  {renderGrid(produtosPorCategoria('Comidas'))}
                                </section>
                              )}

                              {produtosPorCategoria('Personagens').length > 0 && (
                                <section className="secao-conteudo" id="Personagens">
                                  <h3 className="section-title">Personagens! 🧙‍♂️</h3>
                                  {renderGrid(produtosPorCategoria('Personagens'))}
                                </section>
                              )}

                              <Whatsapp />
                            </>
                          )}
                      </div>

                      <Footer />
                    </div>
                  )
                }/api';

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
        <img className="entrega-img" src="/assets/Imagens/Entrega.png.png" alt="Entrega" />
      </div>
      <div className={`banner-img ${activeIndex === 1 ? 'fade-in' : 'fade-out'}`}>
        <img className="personalizado-img" src="/Assets/Imagens/banner2.png" alt="Personalizados" />
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

  // Carregar produtos do backend
  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/produto`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      } else {
        console.error('Erro ao carregar produtos')
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePesquisa = async (e) => {
    e.preventDefault()
    const termoLower = termo.trim().toLowerCase()
    setPesquisando(true)

    if (!termoLower) {
      setResultados([])
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/produto/buscar?termo=${encodeURIComponent(termoLower)}`,
        {
          credentials: 'include'
        }
      )

      if (response.ok) {
        const data = await response.json()
        setResultados(data)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
    }
  }

  const handleVoltar = () => {
    setPesquisando(false)
    setTermo("")
    setResultados([])
  }

  const renderGrid = (items) => (
    <div className="grid">
      {items.map((item) => (
        <div key={item.id} className="item">
          <Link to={`/produto/${encodeURIComponent(item.nome)}`}>
            <img
              src="https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/boneco.jpg"
              alt={item.nome}
              onError={(e) => {
                e.target.src = 'https://raw.githubusercontent.com/guilhermeeduarte/loja-ro-seahorse/refs/heads/main/api/Amigurumi/src/main/resources/static/web-client/Assets/Imagens/boneco.jpg'
              }}
            />
            <p>{item.nome}</p>
          </Link>
        </div>
      ))}
    </div>
  )

  const produtosPorCategoria = (categoria) => {
    return produtos.filter(p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase())
  }

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Carregando produtos...</p>
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
            : <p style={{ textAlign: 'center' }}>Nenhum resultado encontrado.</p>
          : (
            <>
              <Banner />

              {produtosPorCategoria('Mais vendidos').length > 0 && (
                <section className="secao-conteudo" id="MaisVendidos">
                  <h3 className="section-title">Mais vendidos! ⭐</h3>
                  {renderGrid(produtosPorCategoria('Mais vendidos'))}
                </section>
              )}

              {produtosPorCategoria('Animais').length > 0 && (
                <section className="secao-conteudo" id="Animais">
                  <h3 className="section-title">Animais! 🐾</h3>
                  {renderGrid(produtosPorCategoria('Animais'))}
                </section>
              )}

              {produtosPorCategoria('Destaque').length > 0 && (
                <section className="secao-conteudo" id="Destaque">
                  <h3 className="section-title">Destaque! 🥇</h3>
                  {renderGrid(produtosPorCategoria('Destaque'))}
                </section>
              )}

              {produtosPorCategoria('Comidas').length > 0 && (
                <section className="secao-conteudo" id="Comidas">
                  <h3 className="section-title">Comidas! 🍔</h3>
                  {renderGrid(produtosPorCategoria('Comidas'))}
                </section>
              )}

              {produtosPorCategoria('Personagens').length > 0 && (
                <section className="secao-conteudo" id="Personagens">
                  <h3 className="section-title">Personagens! 🧙‍♂️</h3>
                  {renderGrid(produtosPorCategoria('Personagens'))}
                </section>
              )}

              <Whatsapp />
            </>
          )}
      </div>

      <Footer />
    </div>
  )
}