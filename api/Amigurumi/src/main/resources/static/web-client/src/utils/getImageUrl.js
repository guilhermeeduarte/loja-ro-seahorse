// Recebe um valor 'img' que pode ser:
// - URL absoluta (https://...)
// - caminho absoluto começando com / (ex: /Assets/Imagens/..)
// - caminho relativo como 'Imagens/Harry.jpg' ou 'Harry.jpg'
// Retorna uma URL pública que aponta para a pasta onde as imagens ficam após build: '/assets/imagens/<filename>'
export function getImageUrl(img) {
  if (!img) return '/assets/imagens/placeholder.png'

  const trimmed = String(img).trim()
  // se já for URL absoluta, retorna sem alteração
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  // se começar com barra, normaliza caminhos que apontam para /Assets/Imagens ou /assets/Imagens
  if (/^\//.test(trimmed)) {
    // se já for '/assets/imagens/..' mantém
    if (/^\/assets\/imagens\//i.test(trimmed)) return trimmed
    // se for algo como '/Assets/Imagens/..' ou '/assets/Imagens/..' -> extrai filename
    const parts = trimmed.split(/[/\\]/)
    const filename = parts[parts.length - 1]
    return `/assets/imagens/${filename}`
  }

  // extrai somente o nome do arquivo (última parte após / ou \\\)
  const parts = trimmed.split(/[/\\\\]/)
  const filename = parts[parts.length - 1]

  // monta caminho público padrão (lowercase): /assets/imagens/<filename>
  return `/assets/imagens/${filename}`
}

export default getImageUrl
