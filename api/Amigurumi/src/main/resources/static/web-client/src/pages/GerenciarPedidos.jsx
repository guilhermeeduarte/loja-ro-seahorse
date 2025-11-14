import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const API_URL = 'http://localhost:3000/api'

const GerenciarPedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [devolucoes, setDevolucoes] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroDevolucao, setFiltroDevolucao] = useState('')
  const [modoVisualizacao, setModoVisualizacao] = useState('pedidos') // 'pedidos' ou 'devolucoes'
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(null)

  useEffect(() => {
    if (modoVisualizacao === 'pedidos') {
      carregarPedidos()
    } else {
      carregarDevolucoes()
    }
  }, [filtroStatus, filtroDevolucao, modoVisualizacao])

  const carregarPedidos = async () => {
    try {
      const url = filtroStatus
        ? `${API_URL}/pedido/todos?status=${filtroStatus}`
        : `${API_URL}/pedido/todos`

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }

      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const carregarDevolucoes = async () => {
    try {
      const url = filtroDevolucao
        ? `${API_URL}/devolucao/todas?status=${filtroDevolucao}`
        : `${API_URL}/devolucao/todas`

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar devoluções')
      }

      const data = await response.json()
      setDevolucoes(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao carregar devoluções')
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatus = async (pedidoId, novoStatus) => {
    setAtualizando(pedidoId)
    try {
      const response = await fetch(`${API_URL}/pedido/${pedidoId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: novoStatus })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      alert('Status atualizado com sucesso!')
      carregarPedidos()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar status')
    } finally {
      setAtualizando(null)
    }
  }

  const atualizarDevolucao = async (devolucaoId, acao) => {
    setAtualizando(devolucaoId)
    try {
      const response = await fetch(`${API_URL}/devolucao/${devolucaoId}/${acao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ observacoes: prompt('Observações (opcional):') || '' })
      })

      if (!response.ok) {
        throw new Error(`Erro ao ${acao} devolução`)
      }

      alert(`Devolução ${acao === 'aprovar' ? 'aprovada' : acao === 'rejeitar' ? 'rejeitada' : 'concluída'} com sucesso!`)
      carregarDevolucoes()
    } catch (error) {
      console.error('Erro:', error)
      alert(`Erro ao ${acao} devolução`)
    } finally {
      setAtualizando(null)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDENTE: '#ffc107',
      PAGO: '#17a2b8',
      EM_PREPARO: '#007bff',
      ENVIADO: '#6f42c1',
      ENTREGUE: '#28a745',
      CANCELADO: '#dc3545',
      APROVADA: '#28a745',
      REJEITADA: '#dc3545',
      CONCLUIDA: '#6c757d'
    }
    return colors[status] || '#6c757d'
  }

  const getProximoStatus = (statusAtual) => {
    const fluxo = {
      PENDENTE: 'PAGO',
      PAGO: 'EM_PREPARO',
      EM_PREPARO: 'ENVIADO',
      ENVIADO: 'ENTREGUE'
    }
    return fluxo[statusAtual] || null
  }

  const getTextoProximoStatus = (status) => {
    const textos = {
      PAGO: 'Marcar como Pago',
      EM_PREPARO: 'Iniciar Preparo',
      ENVIADO: 'Marcar como Enviado',
      ENTREGUE: 'Confirmar Entrega'
    }
    return textos[status] || 'Próximo Status'
  }

  if (loading) {
    return (
      <div className="pagina">
        <Navbar />
        <p style={{ textAlign: 'center', padding: '50px' }}>Carregando...</p>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pagina">
      <Navbar />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          {modoVisualizacao === 'pedidos' ? 'Gerenciamento de Pedidos' : 'Gerenciamento de Devoluções'}
        </h2>

        {/* ✅ Toggle entre Pedidos e Devoluções */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            className="botao"
            onClick={() => setModoVisualizacao('pedidos')}
            style={{ background: modoVisualizacao === 'pedidos' ? '#007bff' : '#6c757d' }}
          >
            📦 Pedidos
          </button>
          <button
            className="botao"
            onClick={() => setModoVisualizacao('devolucoes')}
            style={{ background: modoVisualizacao === 'devolucoes' ? '#007bff' : '#6c757d' }}
          >
            🔄 Devoluções
          </button>
        </div>

        {/* Filtros de Pedidos */}
        {modoVisualizacao === 'pedidos' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button
              className="botao"
              onClick={() => setFiltroStatus('')}
              style={{ background: !filtroStatus ? '#007bff' : '#6c757d' }}
            >
              Todos
            </button>
            <button
              className="botao"
              onClick={() => setFiltroStatus('PENDENTE')}
              style={{ background: filtroStatus === 'PENDENTE' ? '#ffc107' : '#6c757d' }}
            >
              Pendentes
            </button>
            <button
              className="botao"
              onClick={() => setFiltroStatus('PAGO')}
              style={{ background: filtroStatus === 'PAGO' ? '#17a2b8' : '#6c757d' }}
            >
              Pagos
            </button>
            <button
              className="botao"
              onClick={() => setFiltroStatus('EM_PREPARO')}
              style={{ background: filtroStatus === 'EM_PREPARO' ? '#007bff' : '#6c757d' }}
            >
              Em Preparo
            </button>
            <button
              className="botao"
              onClick={() => setFiltroStatus('ENVIADO')}
              style={{ background: filtroStatus === 'ENVIADO' ? '#6f42c1' : '#6c757d' }}
            >
              Enviados
            </button>
          </div>
        )}

        {/* Filtros de Devoluções */}
        {modoVisualizacao === 'devolucoes' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button
              className="botao"
              onClick={() => setFiltroDevolucao('')}
              style={{ background: !filtroDevolucao ? '#007bff' : '#6c757d' }}
            >
              Todas
            </button>
            <button
              className="botao"
              onClick={() => setFiltroDevolucao('PENDENTE')}
              style={{ background: filtroDevolucao === 'PENDENTE' ? '#ffc107' : '#6c757d' }}
            >
              Pendentes
            </button>
            <button
              className="botao"
              onClick={() => setFiltroDevolucao('APROVADA')}
              style={{ background: filtroDevolucao === 'APROVADA' ? '#28a745' : '#6c757d' }}
            >
              Aprovadas
            </button>
            <button
              className="botao"
              onClick={() => setFiltroDevolucao('REJEITADA')}
              style={{ background: filtroDevolucao === 'REJEITADA' ? '#dc3545' : '#6c757d' }}
            >
              Rejeitadas
            </button>
          </div>
        )}

        {/* Lista de Pedidos */}
        {modoVisualizacao === 'pedidos' && (
          pedidos.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Nenhum pedido encontrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pedidos.map((pedido) => {
                const proximoStatus = getProximoStatus(pedido.status)

                return (
                  <div
                    key={pedido.id}
                    style={{
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      padding: '20px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>Pedido #{pedido.id}</h3>
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          Cliente: {pedido.usuarioNome} ({pedido.usuarioEmail})
                        </p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '18px' }}>
                          Total: R$ {(pedido.valorTotal + 24.2).toFixed(2).replace('.', ',')}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: getStatusColor(pedido.status),
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            marginBottom: '10px'
                          }}
                        >
                          {pedido.status}
                        </span>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                          {new Date(pedido.dataPedido).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ marginBottom: '5px' }}><strong>Endereço:</strong> {pedido.enderecoEntrega}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <Link to={`/statuspedido?pedidoId=${pedido.id}`}>
                        <button className="botao" style={{ background: '#007bff' }}>
                          Ver Detalhes
                        </button>
                      </Link>

                      {proximoStatus && pedido.status !== 'ENTREGUE' && pedido.status !== 'CANCELADO' && (
                        <button
                          className="botao"
                          onClick={() => atualizarStatus(pedido.id, proximoStatus)}
                          disabled={atualizando === pedido.id}
                          style={{ background: '#28a745' }}
                        >
                          {atualizando === pedido.id
                            ? 'Atualizando...'
                            : getTextoProximoStatus(proximoStatus)
                          }
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Lista de Devoluções */}
        {modoVisualizacao === 'devolucoes' && (
          devolucoes.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Nenhuma devolução encontrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {devolucoes.map((devolucao) => (
                <div
                  key={devolucao.id}
                  style={{
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Devolução #{devolucao.id}</h3>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        Pedido #{devolucao.pedidoId}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        Cliente: {devolucao.usuarioNome} ({devolucao.usuarioEmail})
                      </p>
                    </div>

                    <span
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        backgroundColor: getStatusColor(devolucao.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {devolucao.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p><strong>Motivo:</strong> {devolucao.motivo}</p>
                    {devolucao.descricao && <p><strong>Descrição:</strong> {devolucao.descricao}</p>}
                    {devolucao.observacoesAdmin && (
                      <p style={{ color: '#007bff' }}>
                        <strong>Observações:</strong> {devolucao.observacoesAdmin}
                      </p>
                    )}
                  </div>

                  {/* Imagens */}
                  {devolucao.imagens && devolucao.imagens.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Imagens:</strong>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {devolucao.imagens.map((img, index) => (
                          <img
                            key={index}
                            src={`${API_URL}${img}`}
                            alt={`Devolução ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {devolucao.status === 'PENDENTE' && (
                      <>
                        <button
                          className="botao"
                          onClick={() => atualizarDevolucao(devolucao.id, 'aprovar')}
                          disabled={atualizando === devolucao.id}
                          style={{ background: '#28a745' }}
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          className="botao"
                          onClick={() => atualizarDevolucao(devolucao.id, 'rejeitar')}
                          disabled={atualizando === devolucao.id}
                          style={{ background: '#dc3545' }}
                        >
                          ❌ Rejeitar
                        </button>
                      </>
                    )}

                    {devolucao.status === 'APROVADA' && (
                      <button
                        className="botao"
                        onClick={() => atualizarDevolucao(devolucao.id, 'concluir')}
                        disabled={atualizando === devolucao.id}
                        style={{ background: '#007bff' }}
                      >
                        ✔️ Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  )
}

export default GerenciarPedidos