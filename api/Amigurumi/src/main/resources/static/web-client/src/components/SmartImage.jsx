import React, { useState, useMemo } from 'react'

// Componente que tenta múltiplos caminhos para carregar uma imagem
export default function SmartImage({ src, alt, className, style, width, height, ...rest }) {
  const [index, setIndex] = useState(0)

  const candidates = useMemo(() => {
    const trimmed = String(src || '').trim()

    // 1. URL absoluta (Cloudinary ou qualquer HTTPS)
    if (/^https?:\/\//i.test(trimmed)) {
      return [trimmed]
    }

    // 2. Caminho da API (ex: /api/imagem/abc.jpg) - NÃO USAR, pois API não serve imagens estáticas
    // if (/^\/api\/imagem\//i.test(trimmed)) {
    //   return [`${API_BASE}${trimmed}`]
    // }

    // 3. Extrai apenas o nome do arquivo
    const filename = trimmed ? trimmed.split(/[/\\]/).pop() : 'placeholder.png'

    // 4. Tenta caminhos no Vercel (servidos da pasta public/)
    return [
      `/assets/imagens/${filename}`,           // padrão do Vercel
      `/Assets/Imagens/${filename}`,           // case-sensitive fallback
      `/assets/Imagens/${filename}`,
      `/Assets/imagens/${filename}`,
      `/placeholder.png`,                       // fallback final
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