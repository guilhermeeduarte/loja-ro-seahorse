-- Migration para adicionar coluna 'excluido' nas tabelas usuario e produto
-- Arquivo: src/main/resources/db/migration/V5__add-excluido-columns.sql

-- Adiciona coluna excluido na tabela usuario
ALTER TABLE usuario
ADD COLUMN IF NOT EXISTS excluido BOOLEAN NOT NULL DEFAULT false;

-- Adiciona coluna excluido na tabela produto
ALTER TABLE produto
ADD COLUMN IF NOT EXISTS excluido BOOLEAN NOT NULL DEFAULT false;

-- Cria índices para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_usuario_excluido ON usuario(excluido);
CREATE INDEX IF NOT EXISTS idx_produto_excluido ON produto(excluido);

-- Índice composto para buscar usuários ativos por email (otimiza login)
CREATE INDEX IF NOT EXISTS idx_usuario_email_excluido ON usuario(email, excluido);

-- Índice composto para buscar produtos disponíveis
CREATE INDEX IF NOT EXISTS idx_produto_categoria_excluido ON produto(categoria, excluido);

-- Comentários para documentação
COMMENT ON COLUMN usuario.excluido IS 'Indica se o usuário foi excluído logicamente (soft delete)';
COMMENT ON COLUMN produto.excluido IS 'Indica se o produto foi excluído logicamente (soft delete)';