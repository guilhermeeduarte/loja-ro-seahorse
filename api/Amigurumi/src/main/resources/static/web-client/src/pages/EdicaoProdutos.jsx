import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SmartImage from '../components/SmartImage'
import '../styles.css'

const API_URL = `http://localhost:3000/api`

const ProdutoItem = ({ produto, onSave }) => {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(produto)
  const [imagemFile, setImagemFile] = useState(null)
  const [preview, setPreview] = useState(produto.imagemUrl || null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagemFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave({ ...formData, imagemFile })
    setEditMode(false)
  }

  return (
    <div className="item">
      {editMode ? (
        <div className="form-edicao">
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="form-control"
            placeholder="Nome do produto *"
            required
          />

          <input
            type="file"
            name="imagem"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="preview-container" style={{ marginTop: '10px' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '150px', borderRadius: '8px' }} />
            </div>
          )}

          <input
            type="text"
            name="descricao"
            value={formData.descricao || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Descrição"
          />

          <input
            type="number"
            name="valor"
            value={formData.valor || ""}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="form-control"
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
            className="form-control"
            placeholder="Quantidade em estoque *"
            required
          />

          <select
            name="categoria"
            value={formData.categoria || "Animais"}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Animais">Animais</option>
            <option value="Comidas">Comidas</option>
            <option value="Destaque">Destaque</option>
            <option value="Mais vendidos">Mais Vendidos</option>
            <option value="Personagens">Personagens</option>
          </select>

          <button className="botao" onClick={handleSave}>Salvar</button>
          <button className="botao" onClick={() => setEditMode(false)}>Cancelar</button>
        </div>
      ) : (
        <>
          <SmartImage src={formData.imagemUrl} alt={formData.nome} />
          <p>{formData.nome}</p>
          <button className="botao" onClick={() => setEditMode(true)}>Editar</button>
        </>
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
      let imagemUrl = produtoAtualizado.imagemUrl

      // Se o usuário escolheu um novo arquivo, faz upload primeiro
      if (produtoAtualizado.imagemFile) {
        const formDataImagem = new FormData()
        formDataImagem.append('file', produtoAtualizado.imagemFile)

        const uploadResponse = await fetch(`${API_URL}/imagem/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formDataImagem
        })

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem')
        }

        const uploadData = await uploadResponse.json()
        imagemUrl = uploadData.url
      }

      const produto = {
        nome: produtoAtualizado.nome,
        descricao: produtoAtualizado.descricao,
        valor: parseFloat(produtoAtualizado.valor),
        quantidade: parseInt(produtoAtualizado.quantidade),
        categoria: produtoAtualizado.categoria,
        imagemUrl: imagemUrl
      }

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

      setProdutos((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      )

      alert(`Produto "${updated.nome}" atualizado com sucesso!`)
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar produto: " + error.message)
    }
  }

  return (
    <div className="pagina">
      <Navbar />

      <section id="titulo-edicao" className="titulo-edicao">
        <h1>Edição de Produtos</h1>
      </section>

      <div className="texto-edicao">
        <p>Selecione um produto para editar:</p>
      </div>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <section className="secao-conteudo">
          <h3 className="section-title">Produtos disponíveis</h3>
          <div className="grid-edicao">
            {produtos.map((produto) => (
              <ProdutoItem
                key={produto.id}
                produto={produto}
                onSave={handleSaveProduto}
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
