import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: 'Carregando...',
    email: '-',
    telefone: '-',
    cpf: '-',
    nascimento: '-',
    endereco: '-',
    tipo: 'CLIENTE',
    cargo: '-',
    nivel: 'Gerenciamento de Produtos',
  })

  const [modalAberto, setModalAberto] = useState(false)
  const [editForm, setEditForm] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    senha: '',
  })

  useEffect(() => {
    // Simulação de fetch de dados do usuário
    async function carregarDados() {
      // Aqui você pode substituir por uma chamada real à API
      const dados = {
        nome: 'Luis Silva',
        email: 'luis@seahorse.com',
        telefone: '(11) 91234-5678',
        cpf: '123.456.789-00',
        nascimento: '01/01/1990',
        endereco: 'Rua das Ostras, 123 - São Paulo',
        tipo: 'ADMINISTRADOR',
        cargo: 'Gerente',
      }
      setUsuario((prev) => ({ ...prev, ...dados }))
    }

    carregarDados()
  }, [])

  const abrirModal = () => {
    setEditForm({
      nome: usuario.nome,
      telefone: usuario.telefone,
      endereco: usuario.endereco,
      senha: '',
    })
    setModalAberto(true)
  }

  const fecharModal = () => setModalAberto(false)

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const salvarAlteracoes = (e) => {
    e.preventDefault()
    // Aqui você pode enviar os dados para a API
    setUsuario((prev) => ({
      ...prev,
      nome: editForm.nome,
      telefone: editForm.telefone,
      endereco: editForm.endereco,
    }))
    fecharModal()
  }

  const logout = () => {
    alert('Logout realizado!')
    // Redirecionar ou limpar sessão
  }

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-cadastro" className="titulo-cadastro">
        <h1>Meu Perfil</h1>
      </section>

      <div className="perfil-container">
        <div className="perfil-card">
          <div className="perfil-header">
            <div className="perfil-avatar">
              <img src="../assets/Imagens/perfil.png" width="100px" alt="Avatar do usuário" />
            </div>
            <div className="perfil-info-header">
              <h2>{usuario.nome}</h2>
              <span className="badge-tipo">{usuario.tipo}</span>
            </div>
          </div>

          <div className="perfil-section">
            <h3>📋 Informações Pessoais</h3>
            <div className="info-grid">
              <div className="info-item"><label>Email:</label><p>{usuario.email}</p></div>
              <div className="info-item"><label>Telefone:</label><p>{usuario.telefone}</p></div>
              <div className="info-item"><label>CPF:</label><p>{usuario.cpf}</p></div>
              <div className="info-item"><label>Data de Nascimento:</label><p>{usuario.nascimento}</p></div>
              <div className="info-item full-width"><label>Endereço:</label><p>{usuario.endereco}</p></div>
            </div>
          </div>

          {usuario.tipo !== 'CLIENTE' && (
            <div className="perfil-section perfil-admin">
              <h3>🔐 Área Administrativa</h3>
              <div className="admin-info">
                <p><strong>Cargo:</strong> {usuario.cargo}</p>
                <p><strong>Nível de Acesso:</strong> {usuario.nivel}</p>
              </div>
              <div className="admin-buttons">
                <button className="botao-admin" onClick={() => window.location.href = '/cadastroproduto'}>📦 Cadastrar Produtos</button>
                <button className="botao-admin">📝 Editar Produtos</button>
                <button className="botao-admin">📊 Ver Pedidos</button>
                <button className="botao-admin">👥 Gerenciar Usuários</button>
              </div>
            </div>
          )}

          <div className="perfil-actions">
            <button className="botao" onClick={abrirModal}>Editar</button>
            <button className="botao" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={fecharModal}>&times;</span>
            <h2>Editar Perfil</h2>
            <form onSubmit={salvarAlteracoes}>
              <div className="campos-formulario">
                <label>Nome:</label>
                <input type="text" name="nome" value={editForm.nome} onChange={handleEditChange} required />
              </div>
              <div className="campos-formulario">
                <label>Telefone:</label>
                <input type="text" name="telefone" value={editForm.telefone} onChange={handleEditChange} required />
              </div>
              <div className="campos-formulario">
                <label>Endereço:</label>
                <input type="text" name="endereco" value={editForm.endereco} onChange={handleEditChange} required />
              </div>
              <div className="campos-formulario">
                <label>Nova Senha (opcional):</label>
                <input type="password" name="senha" value={editForm.senha} onChange={handleEditChange} placeholder="••••••••" />
              </div>
              <button type="submit" className="botao">Salvar Alterações</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Perfil
