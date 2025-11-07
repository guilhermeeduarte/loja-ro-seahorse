import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProdutoDetalhe from "../components/ProdutoDetalhe";
import { produtos as produtosLocal } from "../data/produtos";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_URL = `http://localhost:3000/api`;

const ProdutoPage = () => {
  const { produtoNome } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true
    async function buscar(termo) {
      setLoading(true)
      setError(null)
      try {
        // Primeiro, tentar buscar nos dados locais
        const termoNormalized = (termo || '').toLowerCase()
        const localFound = produtosLocal && produtosLocal.find((p) => 
          (p.nome || '').toLowerCase() === termoNormalized || 
          (p.nome || '').toLowerCase().replace(/\s+/g,'-') === termoNormalized
        )
        
        if (localFound) {
          setProduto({
            id: localFound.id,
            nome: localFound.nome,
            descricao: localFound.descricao,
            preco: localFound.preco || localFound.valor,
            categoria: localFound.categoria,
            img: localFound.img,
            detalhes: localFound.detalhes,
          })
          setLoading(false)
          return true
        }

        // Se não encontrou localmente, tenta buscar da API
        const res = await fetch(`${API_URL}/produto/buscar?termo=${encodeURIComponent(termo)}`)
        if (!res.ok) throw new Error(`Erro ao buscar produto: ${res.status}`)
        const data = await res.json()
        console.debug('ProdutoPage: termo', termo, 'resultado', data)

        if (!active) return false

        const found = (data && data.find && data.find((p) => p.nome && p.nome.toLowerCase() === termo.toLowerCase())) || (data && data[0])
        if (found) {
          setProduto({
            id: found.id,
            nome: found.nome,
            descricao: found.descricao,
            preco: found.valor,
            categoria: found.categoria,
            img: found.imagemUrl || `/assets/imagens/boneco.jpg`,
            detalhes: found.detalhes,
          })
          return true
        }

          
        setProduto(null)
        return false
      } catch (err) {
        console.error(err)
        // Se a API falhar mas já encontramos localmente, não mostramos o erro
        if (!produto) {
          setError(err.message)
          setProduto(null)
          return false
        }
        return true
      } finally {
        if (active) setLoading(false)
      }
    }

    if (!produtoNome) return

    // decodifica o parâmetro da rota
    const decoded = decodeURIComponent(produtoNome)
    // primeira tentativa: termo como está
    buscar(decoded).then((foundFirst) => {
      // se não encontrou produto, tentar variante trocando hífens por espaços (caso a rota use 'nome-com-hifen')
      if (!foundFirst) {
        const alt = decoded.replace(/-/g, ' ')
        if (alt !== decoded) {
          buscar(alt)
        }
      }
    })

    return () => { active = false }
  }, [produtoNome])

  if (loading) return <p style={{ textAlign: 'center' }}>Carregando produto...</p>
  if (error) return <p style={{ textAlign: 'center' }}>Erro: {error}</p>
  if (!produto) return <p style={{ textAlign: 'center' }}>Produto não encontrado.</p>

  return <ProdutoDetalhe produto={produto} />;
};

export default ProdutoPage;
