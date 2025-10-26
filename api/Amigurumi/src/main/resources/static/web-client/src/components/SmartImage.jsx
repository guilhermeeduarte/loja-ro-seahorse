import React, { useState, useMemo } from 'react'

// Componente que tenta múltiplos caminhos para carregar uma imagem
// Recebe 'src' que pode ser URL absoluta, caminho relativo ou apenas filename
// Tenta em ordem: direta (se for http), /assets/imagens/, /Assets/Imagens/, /web-client/assets/imagens/, /web-client/Assets/Imagens/ e por fim placeholder
export default function SmartImage({ src, alt, className, style, width, height, ...rest }) {
  const [index, setIndex] = useState(0)

  const candidates = useMemo(() => {
    const trimmed = String(src || '').trim()
    // url absoluta
    if (/^https?:\/\//i.test(trimmed)) return [trimmed]

    // extrai filename
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
