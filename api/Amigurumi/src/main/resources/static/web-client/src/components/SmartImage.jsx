import React, { useState, useMemo } from 'react'

// Componente que tenta múltiplos caminhos para carregar uma imagem
// Suporta: URLs absolutas, caminhos da API (/api/imagem/...), caminhos locais e fallback
export default function SmartImage({ src, alt, className, style, width, height, ...rest }) {
  const [index, setIndex] = useState(0)

  const API_BASE = 'http://loja-ro-seahorse.vercel.app' // ajuste se necessário para produção

  const candidates = useMemo(() => {
    const trimmed = String(src || '').trim()

    // URL absoluta
    if (/^https?:\/\//i.test(trimmed)) return [trimmed]

    // Caminho da API (ex: /api/imagem/abc.jpg)
    if (/^\/api\/imagem\//i.test(trimmed)) return [`${API_BASE}${trimmed}`]

    // Extrai apenas o nome do arquivo
    const filename = trimmed ? trimmed.split(/[/\\]/).pop() : 'placeholder.png'

    return [
      `/assets/imagens/${filename}`,
      `/Assets/Imagens/${filename}`,
      `/web-client/assets/imagens/${filename}`,
      `/web-client/Assets/Imagens/${filename}`,
      trimmed || `/assets/imagens/placeholder.png`,
      '/assets/imagens/placeholder.png',
    ]
  }, [src])

  const handleError = () => {
    setIndex((i) => Math.min(i + 1, candidates.length - 1))
  }

  return (
    <img
      src={candidates[index]}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={handleError}
      {...rest}
    />
  )
}
