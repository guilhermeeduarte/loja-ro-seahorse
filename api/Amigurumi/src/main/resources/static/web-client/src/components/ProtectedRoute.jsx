import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_URL } from '../config/api'

// Componente para proteger rotas baseado no tipo de usuário
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [redirect, setRedirect] = useState(null)

  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        const response = await fetch(`${API_URL}/usuario/perfil`, {
          credentials: 'include'
        })

        if (!response.ok) {
          // Não está logado
          setRedirect('/login')
          return
        }

        const data = await response.json()
        setUsuario(data)

        // Verifica se o tipo de usuário tem permissão
        if (allowedRoles.length > 0 && !allowedRoles.includes(data.tipoUsuario)) {
          alert('Você não tem permissão para acessar esta página!')
          setRedirect('/')
        }

      } catch (error) {
        console.error('Erro ao verificar acesso:', error)
        setRedirect('/login')
      } finally {
        setLoading(false)
      }
    }

    verificarAcesso()
  }, [allowedRoles])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Verificando permissões...
      </div>
    )
  }

  if (redirect) {
    return <Navigate to={redirect} replace />
  }

  // Passa os dados do usuário para os componentes filhos
  return React.cloneElement(children, { usuario })
}

export default ProtectedRoute