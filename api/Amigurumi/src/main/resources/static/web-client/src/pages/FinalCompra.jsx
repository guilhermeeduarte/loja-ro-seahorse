import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

// Componente para cada item do resumo
const ItemResumo = ({ nome, preco }) => (
  <li>
    <span className="produto" style={{ fontSize: '20px', marginTop: 0, marginLeft: '20px' }}>
      {nome}
    </span>
    <span className="preco">{preco}</span>
  </li>
)

const FinalizacaoCompra = () => {
  const itens = [
    { nome: 'Pinguim', preco: 'R$ 89,90' },
    { nome: 'Harry Potter', preco: 'R$ 249,90' },
  ]

  const total = 'R$ 339,90'

  const finalizarCompra = () => {
    alert('Compra finalizada com sucesso!')
    // Aqui você pode redirecionar ou enviar os dados para o backend
  }

  return (
    <div className="pagina">
      <Navbar tipo="carrinho" />

      <nav className="navbar carrinho">
        <div className="container-fluid">
          <a className="navbar-brand" href="/carrinho">
            <span className="voltar">&lt;&lt;</span>
          </a>

          <h2>Seu Carrinho</h2>

          <a className="navbar-brand" href="/pagamentos" id="pagamentos">
            <img
              id="carrinho"
              src="../assets/Imagens/Vector.svg"
              width="50px"
              height="60px"
              alt="carrinho"
            />
          </a>
        </div>
      </nav>

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Resumo da Compra</h1>
      </section>

      <ul className="carrinhos">
        {itens.map((item, index) => (
          <ItemResumo key={index} nome={item.nome} preco={item.preco} />
        ))}
      </ul>

      <div className="total">
        <span style={{ marginLeft: '20px', fontSize: '20px' }}>Total:</span>
        <span className="valor-total">{total}</span>
      </div>

      <button
        className="botao"
        style={{ display: 'block', margin: '0 auto', marginTop: '20px', marginBottom: '20px' }}
        onClick={finalizarCompra}
      >
        Finalizar
      </button>

      <Footer />
    </div>
  )
}

export default FinalizacaoCompra
