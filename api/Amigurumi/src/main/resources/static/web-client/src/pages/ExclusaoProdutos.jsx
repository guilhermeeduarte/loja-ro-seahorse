import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

// Componente reutilizável para cada produto
const ProdutoItem = ({ nome, imagem }) => (
  <div className="item">
    <img src={`../assets/Imagens/${imagem}`} alt={nome} />
    <p>{nome}</p>
  </div>
)

const ExclusaoProdutos = () => {
  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-exclusao" className="titulo-exclusao">
        <h1>Exclusão de Produtos</h1>
      </section>

      <div className="texto-exclusao">
        <p>Produtos disponíveis:</p>
      </div>

      {/* Seção: Mais vendidos */}
      <section className="secao-conteudo ocultavel">
        <h3 className="section-title">Mais vendidos!</h3>
        <div className="grid">
          <ProdutoItem nome="Harry Potter" imagem="Harry_Potter.jpg" />
          <ProdutoItem nome="Pinguim" imagem="Pinguim.jpg" />
          <ProdutoItem nome="Capuccino" imagem="Capuccino.jpg" />
          <ProdutoItem nome="Abacate" imagem="Abacate.jpg" />
        </div>
      </section>

      {/* Seção: Animais */}
      <section className="secao-conteudo ocultavel" id="Animais">
        <h3 className="section-title">Animais! 🐾</h3>
        <div className="grid">
          <ProdutoItem nome="Raposa" imagem="Raposa.jpg" />
          <ProdutoItem nome="Pinguim" imagem="Pinguim.jpg" />
          <ProdutoItem nome="Elefante" imagem="Elefante.jpg" />
          <ProdutoItem nome="Coelho" imagem="Coelho.jpeg" />
        </div>
      </section>

      {/* Seção: Destaque */}
      <section className="secao-conteudo ocultavel" id="Destaque">
        <h3 className="section-title">Destaque</h3>
        <div className="grid">
          <ProdutoItem nome="Hermione Granger" imagem="Hermione.jpg" />
        </div>
      </section>

      {/* Seção: Comidas */}
      <section className="secao-conteudo ocultavel" id="Frutas">
        <h3 className="section-title">Comidas</h3>
        <div className="grid">
          <ProdutoItem nome="Abacaxi" imagem="Abacaxi.jpg" />
          <ProdutoItem nome="Laranja" imagem="Laranja.jpg" />
          <ProdutoItem nome="Abacate" imagem="Abacate.jpg" />
        </div>
      </section>

      {/* Seção: Personagens */}
      <section className="secao-conteudo ocultavel" id="Personagens">
        <h3 className="section-title">Personagens</h3>
        <div className="grid">
          <ProdutoItem nome="Hermione Granger" imagem="Hermione.jpg" />
          <ProdutoItem nome="Harry Potter" imagem="Harry_Potter.jpg" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ExclusaoProdutos
