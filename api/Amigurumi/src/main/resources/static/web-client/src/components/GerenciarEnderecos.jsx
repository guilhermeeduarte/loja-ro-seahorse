import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const GerenciarEnderecos = () => {
  const navigate = useNavigate()
  const [enderecos, setEnderecos] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    apelido: '',
    cep: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    observacoes: '',
    principal: false
  })

  useEffect(() => {
    carregarEnderecos()
  }, [])

  const carregarEnderecos = async () => {
    try {
      const response = await fetch(`${API_URL}/endereco`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setEnderecos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const buscarCep = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      alert('CEP inválido')
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado')
      } else {
        setFormData(prev => ({
          ...prev,
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro || '',
          rua: data.logradouro || ''
        }))
      }
    } catch (error) {
      alert('Erro ao buscar CEP')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/endereco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Endereço cadastrado com sucesso!')
        setFormData({
          apelido: '',
          cep: '',
          pais: 'Brasil',
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          complemento: '',
          observacoes: '',
          principal: false
        })
        setMostrarForm(false)
        carregarEnderecos()
      } else {
        const erro = await response.text()
        alert(`Erro: ${erro}`)
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao cadastrar endereço')
    }
  }

  const definirComoPrincipal = async (id) => {
    try {
      const response = await fetch(`${API_URL}/endereco/${id}/principal`, {
        method: 'PUT',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Endereço principal atualizado!')
        carregarEnderecos()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const deletarEndereco = async (id) => {
    if (!confirm('Deseja realmente excluir este endereço?')) return

    try {
      const response = await fetch(`${API_URL}/endereco/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Endereço removido!')
        carregarEnderecos()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Meus Endereços</h1>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Carregando...</p>
        ) : (
          <>
            {/* Lista de endereços */}
            <div style={{ marginBottom: '30px' }}>
              {enderecos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>
                  Você ainda não tem endereços cadastrados
                </p>
              ) : (
                enderecos.map(endereco => (
                  <div
                    key={endereco.id}
                    style={{
                      border: endereco.principal ? '3px solid #007bff' : '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '15px',
                      background: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>
                          {endereco.apelido}
                          {endereco.principal && (
                            <span style={{
                              marginLeft: '10px',
                              padding: '4px 8px',
                              background: '#007bff',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'normal'
                            }}>
                              Principal
                            </span>
                          )}
                        </h3>
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          {endereco.enderecoCompleto}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                        {!endereco.principal && (
                          <button
                            className="botao"
                            onClick={() => definirComoPrincipal(endereco.id)}
                            style={{ padding: '8px 16px', fontSize: '14px' }}
                          >
                            Tornar Principal
                          </button>
                        )}
                        <button
                          onClick={() => deletarEndereco(endereco.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Botão adicionar */}
            {!mostrarForm && (
              <button
                className="botao"
                onClick={() => setMostrarForm(true)}
                style={{ display: 'block', margin: '0 auto' }}
              >
                + Adicionar Novo Endereço
              </button>
            )}

            {/* Formulário */}
            {mostrarForm && (
              <form onSubmit={handleSubmit} className="endereco" style={{ marginTop: '30px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Novo Endereço</h3>

                <input
                  type="text"
                  name="apelido"
                  placeholder="Apelido do endereço (ex: Casa, Trabalho) *"
                  value={formData.apelido}
                  onChange={handleChange}
                  required
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    name="cep"
                    placeholder="CEP *"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={buscarCep}
                    maxLength="9"
                    required
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    name="estado"
                    placeholder="UF *"
                    value={formData.estado}
                    onChange={handleChange}
                    maxLength="2"
                    required
                    style={{ width: '80px' }}
                  />
                </div>

                <input
                  type="text"
                  name="cidade"
                  placeholder="Cidade *"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="bairro"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="rua"
                  placeholder="Rua *"
                  value={formData.rua}
                  onChange={handleChange}
                  required
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    name="numero"
                    placeholder="Número *"
                    value={formData.numero}
                    onChange={handleChange}
                    required
                    style={{ width: '120px' }}
                  />
                  <input
                    type="text"
                    name="complemento"
                    placeholder="Complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>

                <textarea
                  name="observacoes"
                  placeholder="Observações (ponto de referência, instruções de entrega...)"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="3"
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    name="principal"
                    checked={formData.principal}
                    onChange={handleChange}
                  />
                  <span>Definir como endereço principal</span>
                </label>

                <div className="botao-endereco">
                  <button className="botao" type="submit">
                    Salvar Endereço
                  </button>
                  <button
                    className="botao-limpar"
                    type="button"
                    onClick={() => setMostrarForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default GerenciarEnderecos