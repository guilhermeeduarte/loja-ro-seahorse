import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Whatsapp from '../components/Whatsapp'
import SmartImage from '../components/SmartImage'
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
        <img className="entrega-img" src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799374266105957/Entrega.png.png?ex=68feba94&is=68fd6914&hm=d1c5555ec2662d13a31ac9d0313d2f9e3641808ea64a22034e369f0de8e57f4b&" alt="Entrega" />
      </div>

    </section>
  )
}

// Lista de produtos
export const produtos = [
  { categoria: "Mais vendidos", nome: "Harry Potter", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799375897559171/Harry_Potter.jpg?ex=68feba94&is=68fd6914&hm=65c43c90b7ff02d7c28d20ab4133502381b160ad6c9839b89743df76b64a978d&" },
  { categoria: "Mais vendidos", nome: "Pinguim", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799426497777675/Pinguim.jpg?ex=68febaa0&is=68fd6920&hm=0fcbf04efd9dc671c2467f4871957ed16aae0d234e316743c1277afb789768d6&" },
  { categoria: "Mais vendidos", nome: "Capuccino", img: "https://media.discordapp.net/attachments/1431799178337583195/1431799331031089203/Capuccino.jpg?ex=68feba8a&is=68fd690a&hm=5549f96bff5c0e22d0ed3864e6faf3fbf0b9e3c555d28fad677bc5ed9ce7e46e&=&format=webp" },
  { categoria: "Mais vendidos", nome: "Abacate", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799332683645038/Abacate.jpg?ex=68feba8a&is=68fd690a&hm=760933653a58503c7395c586011275e6e5fdd30f717d5e368d900fee1fcd8e32&"},

  { categoria: "Animais", nome: "Raposa", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799467991896276/Raposa.jpg?ex=68febaaa&is=68fd692a&hm=08054db5953e734a372c8c86236f269c500dcdd2d3e114fe0fd036da779dc606&" },
  { categoria: "Animais", nome: "Elefante", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799373192368351/Elefante.jpg?ex=68feba94&is=68fd6914&hm=110409383ab106c1ddedeb3bf09908c5921e46b226ff1b3078c529d43093fa82&" },
  { categoria: "Animais", nome: "Coelho", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799332306423859/Coelho.jpeg?ex=68feba8a&is=68fd690a&hm=dfdc355d8ff647525293c323e1b72e3979e58d9becb1b6546af6253d8c27793d&" },

  { categoria: "Destaque", nome: "Hermione Granger", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799423905697933/Hermione.jpg?ex=68febaa0&is=68fd6920&hm=f342d0ea45cda9372b40388a0028c93c1741f9d2dd2244b704d9764f06ae2d72&" },

  { categoria: "Comidas", nome: "Abacaxi", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799333128245308/Abacaxi.jpg?ex=68feba8a&is=68fd690a&hm=cd9d824d2f673ef0d919246770e9f04f51e3f842794ddef65ca93402a09c909c&" },
  { categoria: "Comidas", nome: "Laranja", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799424526581872/Laranja.jpg?ex=68febaa0&is=68fd6920&hm=06aa8f706ad1152d5982257ecb21b6a81acc0d9855347c61940cb931ca0dff4a&" },

  { categoria: "Personagens", nome: "Hermione Granger", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799423905697933/Hermione.jpg?ex=68febaa0&is=68fd6920&hm=f342d0ea45cda9372b40388a0028c93c1741f9d2dd2244b704d9764f06ae2d72&" },
  { categoria: "Personagens", nome: "Harry Potter", img: "https://cdn.discordapp.com/attachments/1431799178337583195/1431799375897559171/Harry_Potter.jpg?ex=68feba94&is=68fd6914&hm=65c43c90b7ff02d7c28d20ab4133502381b160ad6c9839b89743df76b64a978d&" },
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
