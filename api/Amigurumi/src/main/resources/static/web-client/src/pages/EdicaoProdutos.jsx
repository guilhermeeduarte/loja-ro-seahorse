import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SmartImage from '../components/SmartImage'
import '../styles.css'
import { API_URL } from '../config/api'

const ProdutoItem = ({ produto, onSave, onDelete }) => {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(produto)

  // Suporta até 3 imagens: imagemUrl, imagemUrl2, imagemUrl3
  const [imagemFiles, setImagemFiles] = useState([null, null, null])
  const [previews, setPreviews] = useState([
    produto.imagemUrl || null,
    produto.imagemUrl2 || null,
    produto.imagemUrl3 || null,
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index) => (e) => {
    const file = e.target.files[0]
    if (file) {
      const newFiles = [...imagemFiles]
      newFiles[index] = file
      setImagemFiles(newFiles)

      const reader = new FileReader()
      reader.onload = () => {
        const newPreviews = [...previews]
        newPreviews[index] = reader.result
        setPreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index) => {
    const newFiles = [...imagemFiles]
    newFiles[index] = null
    setImagemFiles(newFiles)

    const newPreviews = [...previews]
    newPreviews[index] = null
    setPreviews(newPreviews)

    // também limpa o campo correspondente em formData para sinalizar remoção
    const mapField = index === 0 ? 'imagemUrl' : index === 1 ? 'imagemUrl2' : 'imagemUrl3'
    setFormData((prev) => ({ ...prev, [mapField]: null }))
  }

  const handleSave = () => {
    // envia as imagens selecionadas (array) junto com o formData
    onSave({ ...formData, imagemFiles })
    setEditMode(false)
  }

  return (
    <div className="edit-card">
      {editMode ? (
        <div className="edit-card-form">
          <div className="edit-card-header">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="edit-input"
              placeholder="Nome do produto *"
              required
            />
          </div>

          <div className="edit-card-body">
            <div className="edit-card-previews">
              {[0, 1, 2].map((i) => (
                <div key={i} className="edit-preview-slot">
                  <label className="file-label">
                    <input
                      type="file"
                      name={`imagem-${i}`}
                      className="file-input"
                      accept="image/*"
                      onChange={handleImageChange(i)}
                    />
                    <span className="file-label-text">Selecionar</span>
                  </label>

                  {previews[i] ? (
                    <div className="edit-preview">
                      <img src={previews[i]} alt={`Preview ${i + 1}`} />
                      <button type="button" className="botao-card secondary" onClick={() => removeImage(i)}>Remover</button>
                    </div>
                  ) : (
                    <div className="edit-preview empty">Sem imagem</div>
                  )}
                </div>
              ))}
            </div>

            <div className="edit-card-fields">
              <textarea
                name="descricao"
                value={formData.descricao || ""}
                onChange={handleChange}
                className="edit-textarea"
                placeholder="Descrição"
              />

              <div className="edit-row">
                <input
                  type="number"
                  name="valor"
                  value={formData.valor || ""}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="edit-input small"
                  placeholder="Preço (R$) *"
                  required
                />

                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade || ""}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  className="edit-input small"
                  placeholder="Quantidade *"
                  required
                />

                <select
                  name="categoria"
                  value={formData.categoria ?? ""}
                  onChange={handleChange}
                  className="edit-input small"
                >
                  <option value="">Sem categoria</option>
                  <option value="Animais">Animais</option>
                  <option value="Comidas">Comidas</option>
                  <option value="Destaque">Destaque</option>
                  <option value="Mais vendidos">Mais Vendidos</option>
                  <option value="Personagens">Personagens</option>
                </select>
              </div>
            </div>
          </div>

          <div className="edit-card-actions">
            <button className="botao-card" onClick={handleSave}>Salvar</button>
            <button className="botao-card secondary" onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="edit-card-view">
          <SmartImage src={formData.imagemUrl} alt={formData.nome} />
          <div className="edit-card-view-info">
            <p className="edit-card-title">{formData.nome}</p>
            <p className="edit-card-price">R$ {Number(formData.valor || 0).toFixed(2).replace('.', ',')}</p>
            {formData.categoria && <small className="badge-category">{formData.categoria}</small>}
            <p className="edit-card-desc">{formData.descricao || <i>Sem descrição</i>}</p>
            <div className="edit-card-meta">
              <span>Qtd: {formData.quantidade ?? 0}</span>
              <span style={{marginLeft: '8px'}}>ID: {formData.id}</span>
            </div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button className="botao-card edit-btn" onClick={() => setEditMode(true)}>Editar</button>
              <button
                className="botao-card"
                style={{ background: '#dc3545', borderRadius: 8 }}
                onClick={() => {
                  if (confirm(`Deseja remover o produto "${formData.nome}" (ID ${formData.id})?`)) {
                    onDelete && onDelete(formData.id)
                  }
                }}
              >Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const EdicaoProdutos = () => {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 Carregar produtos do banco
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await fetch(`${API_URL}/produto`, {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok) throw new Error("Erro ao buscar produtos")
        const data = await res.json()
        setProdutos(data)
      } catch (error) {
        console.error(error)
        alert("Erro ao carregar produtos.")
      } finally {
        setLoading(false)
      }
    }
    carregarProdutos()
  }, [])

  // 🔹 Salvar edição no banco
  const handleSaveProduto = async (produtoAtualizado) => {
    try {
      console.log('handleSaveProduto chamado:', produtoAtualizado)

      // prepara URLs atuais (podem ser null se removidas)
      let imagemUrl = produtoAtualizado.imagemUrl || null
      let imagemUrl2 = produtoAtualizado.imagemUrl2 || null
      let imagemUrl3 = produtoAtualizado.imagemUrl3 || null

      // Se o usuário forneceu um array imagemFiles, faz upload dos que existem
      if (produtoAtualizado.imagemFiles && Array.isArray(produtoAtualizado.imagemFiles)) {
        for (let i = 0; i < 3; i++) {
          const file = produtoAtualizado.imagemFiles[i]
          if (file) {
            const formDataImagem = new FormData()
            formDataImagem.append('file', file)

            const uploadResponse = await fetch(`${API_URL}/imagem/upload`, {
              method: 'POST',
              credentials: 'include',
              body: formDataImagem
            })

            if (!uploadResponse.ok) {
              const text = await uploadResponse.text()
              throw new Error('Erro ao fazer upload da imagem ' + (i + 1) + ': ' + text)
            }

            const uploadData = await uploadResponse.json()
            console.log('uploadData', i + 1, uploadData)
            // varios formatos possíveis: { url }, { imagemUrl }, { data: { url } }
            const uploadedUrl = uploadData.url || uploadData.imagemUrl || (uploadData.data && uploadData.data.url) || null
            if (!uploadedUrl) console.warn('Upload não retornou URL esperada:', uploadData)

            if (i === 0) imagemUrl = uploadedUrl || imagemUrl
            if (i === 1) imagemUrl2 = uploadedUrl || imagemUrl2
            if (i === 2) imagemUrl3 = uploadedUrl || imagemUrl3
          }
        }
      }

      const produto = {
        nome: produtoAtualizado.nome,
        descricao: produtoAtualizado.descricao,
        valor: parseFloat(produtoAtualizado.valor),
        quantidade: parseInt(produtoAtualizado.quantidade),
        categoria: produtoAtualizado.categoria || null,
        imagemUrl: imagemUrl,
        imagemUrl2: imagemUrl2,
        imagemUrl3: imagemUrl3,
      }

      console.log('Enviando PUT /produto payload:', produto)

      const res = await fetch(`${API_URL}/produto/${produtoAtualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(produto),
      })

      if (!res.ok) {
        const erro = await res.text()
        throw new Error("Erro ao atualizar produto: " + erro)
      }

      const updated = await res.json()
      console.log('Produto atualizado (backend):', updated)

      // Garantir que as URLs fiquem presentes no objeto final (merge)
      const merged = {
        ...produtoAtualizado,
        ...updated,
        imagemUrl: updated.imagemUrl ?? imagemUrl,
        imagemUrl2: updated.imagemUrl2 ?? imagemUrl2,
        imagemUrl3: updated.imagemUrl3 ?? imagemUrl3,
      }

      setProdutos((prev) => prev.map((p) => (p.id === merged.id ? merged : p)))

      alert(`Produto "${merged.nome}" atualizado com sucesso!`)
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar produto: " + error.message)
    }
  }

  // 🔹 Remover produto (marcar como excluído) no backend e atualizar lista
  const handleDeleteProduto = async (id) => {
    if (!id) return
    try {
      const res = await fetch(`${API_URL}/produto/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error('Erro ao remover produto: ' + text)
      }
      // remover localmente
      setProdutos((prev) => prev.filter((p) => p.id !== id))
      alert('Produto removido com sucesso')
    } catch (error) {
      console.error(error)
      alert('Erro ao remover produto: ' + error.message)
    }
  }

  return (
    <div className="pagina">
      <Navbar />
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <section className="secao-conteudo">
          <h3 className="section-title">Produtos disponíveis</h3>
          <div className="edit-grid">
            {produtos.map((produto) => (
              <ProdutoItem
                key={produto.id}
                produto={produto}
                onSave={handleSaveProduto}
                onDelete={handleDeleteProduto}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default EdicaoProdutos
