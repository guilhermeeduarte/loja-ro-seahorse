import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCarrinho } from '../contexts/CartContext'
import '../styles.css'

const API_URL = 'http://localhost:3000/api'

const ProcessarPagamento = () => {
  const navigate = useNavigate()
  const { limparCarrinho } = useCarrinho()
  const [loading, setLoading] = useState(false)
  const [linkPagamento, setLinkPagamento] = useState(null)
  const [pedidoId, setPedidoId] = useState(null)

  useEffect(() => {
    const valorTotal = sessionStorage.getItem("valorTotal")
    const enderecoEntrega = sessionStorage.getItem("enderecoEntrega")

    if (!valorTotal || !enderecoEntrega) {
      alert("Dados incompletos! Refaça o pedido.")
      navigate("/carrinho")
      return
    }

    criarPedidoEGerarPagamento(valorTotal, enderecoEntrega)
  }, [navigate])

  const criarPedidoEGerarPagamento = async (valorTotal, enderecoEntrega) => {
    setLoading(true)
    try {
      // 1. Criar pedido no backend (status PENDENTE)
      const responsePedido = await fetch(`${API_URL}/pedido/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          enderecoEntrega: enderecoEntrega,
          formaPagamento: 'PENDENTE' // Será atualizado após pagamento
        })
      })

      if (!responsePedido.ok) {
        const erro = await responsePedido.text()
        throw new Error(erro)
      }

      const pedido = await responsePedido.json()
      setPedidoId(pedido.pedidoId)

      // 2. Gerar link de pagamento via API do backend
      const responsePagamento = await fetch(`${API_URL}/pagamento/gerar-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pedidoId: pedido.pedidoId,
          valor: parseFloat(valorTotal),
          descricao: `Pedido #${pedido.pedidoId} - RO SeaHorse`
        })
      })

      if (!responsePagamento.ok) {
        throw new Error('Erro ao gerar link de pagamento')
      }

      const pagamentoData = await responsePagamento.json()
      setLinkPagamento(pagamentoData.url)

      // Limpa o carrinho e sessionStorage
      limparCarrinho()
      sessionStorage.removeItem("valorTotal")
      sessionStorage.removeItem("enderecoEntrega")

    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro ao processar pedido: ${error.message}`)
      navigate("/carrinho")
    } finally {
      setLoading(false)
    }
  }

  const abrirPagamento = () => {
    if (linkPagamento) {
      window.open(linkPagamento, '_blank')
      // Após abrir, redireciona para status do pedido
      setTimeout(() => {
        navigate(`/statuspedido?pedidoId=${pedidoId}`)
      }, 1000)
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>{loading ? 'Processando Pedido...' : 'Pedido Criado!'}</h1>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Aguarde enquanto geramos seu link de pagamento...</p>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : linkPagamento ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Pedido #{pedidoId} criado com sucesso!</h3>
          <p style={{ marginTop: '20px', fontSize: '18px' }}>
            Clique no botão abaixo para realizar o pagamento:
          </p>
          <button
            className="botao"
            onClick={abrirPagamento}
            style={{ marginTop: '30px', fontSize: '20px', padding: '15px 40px' }}
          >
            💳 Ir para Pagamento
          </button>
          <p style={{ marginTop: '30px', color: '#666' }}>
            Após pagar, você será redirecionado para acompanhar o status do pedido.
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Erro ao gerar pagamento. Tente novamente.</p>
          <button className="botao" onClick={() => navigate("/carrinho")}>
            Voltar ao Carrinho
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ProcessarPagamento