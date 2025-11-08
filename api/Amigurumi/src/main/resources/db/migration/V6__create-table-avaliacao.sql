CREATE TABLE avaliacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario VARCHAR(1000),
    data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    excluido BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, produto_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_avaliacao_produto ON avaliacao(produto_id);
CREATE INDEX idx_avaliacao_usuario ON avaliacao(usuario_id);
CREATE INDEX idx_avaliacao_excluido ON avaliacao(excluido);
CREATE INDEX idx_avaliacao_data ON avaliacao(data_avaliacao DESC);

-- Comentários
COMMENT ON TABLE avaliacao IS 'Armazena avaliações de produtos feitas pelos usuários';
COMMENT ON COLUMN avaliacao.nota IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN avaliacao.excluido IS 'Soft delete para avaliações';