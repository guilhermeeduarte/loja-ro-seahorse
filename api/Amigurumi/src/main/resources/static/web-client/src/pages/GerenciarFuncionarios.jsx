import React, { useEffect, useState } from 'react'
import { API_URL } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles.css'

const GerenciarFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', tipoUsuario: 'FUNCIONARIO' })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  const carregarFuncionarios = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/usuario`, { credentials: 'include' })
      if (!res.ok) throw new Error('Erro ao carregar funcionários')
      const data = await res.json()
      setFuncionarios(data)
    } catch (err) {
      console.error(err)
      alert('Erro ao carregar funcionários')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Funcionário criado')
      setForm({ nome: '', email: '', senha: '', telefone: '', tipoUsuario: 'FUNCIONARIO' })
      carregarFuncionarios()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar funcionário')
    }
  }

  const startEdit = (usuario) => {
    setEditId(usuario.id)
    setForm({ nome: usuario.nome || '', email: usuario.email || '', senha: '', telefone: usuario.telefone || '', tipoUsuario: usuario.tipoUsuario || 'FUNCIONARIO' })
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm({ nome: '', email: '', senha: '', telefone: '', tipoUsuario: 'FUNCIONARIO' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const payload = { nome: form.nome, telefone: form.telefone, endereco: '', tipoUsuario: form.tipoUsuario }
      if (form.senha) payload.senha = form.senha

      const res = await fetch(`${API_URL}/usuario/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      alert('Funcionário atualizado')
      cancelEdit()
      carregarFuncionarios()
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar funcionário')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja desativar este usuário?')) return
    try {
      const res = await fetch(`${API_URL}/usuario/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error(await res.text())
      alert('Usuário desativado')
      carregarFuncionarios()
    } catch (err) {
      console.error(err)
      alert('Erro ao desativar usuário')
    }
  }

  if (loading) return (
    <div className="pagina"><Navbar /><p style={{textAlign:'center',padding:'50px'}}>Carregando...</p><Footer/></div>
  )

  return (
    <div className="pagina">
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Gerenciar Funcionários</h2>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editId ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h3>
          <form onSubmit={editId ? handleUpdate : handleAdd} className="form-edicao">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required={!editId} />
            <input name="senha" value={form.senha} onChange={handleChange} placeholder={editId ? 'Senha (deixe vazio para manter)' : 'Senha'} type="password" />
            <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" />
            <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange}>
              <option value="FUNCIONARIO">FUNCIONÁRIO</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="botao" type="submit">{editId ? 'Salvar' : 'Criar'}</button>
              {editId && <button type="button" className="botao" onClick={cancelEdit}>Cancelar</button>}
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Lista de Funcionários</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone}</td>
                  <td>{u.tipoUsuario}</td>
                  <td>
                    <button className="botao" onClick={() => startEdit(u)}>Editar</button>
                    <button className="botao" style={{ background: '#dc3545' }} onClick={() => handleDelete(u.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default GerenciarFuncionarios
