CREATE TABLE devolucao (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    descricao VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    data_conclusao TIMESTAMP,
    observacoes_admin VARCHAR(1000),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE devolucao_imagem (
    id BIGSERIAL PRIMARY KEY,
    devolucao_id BIGINT NOT NULL,
    imagem_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (devolucao_id) REFERENCES devolucao(id) ON DELETE CASCADE
);

CREATE INDEX idx_devolucao_pedido ON devolucao(pedido_id);
CREATE INDEX idx_devolucao_usuario ON devolucao(usuario_id);
CREATE INDEX idx_devolucao_status ON devolucao(status);
CREATE INDEX idx_devolucao_data ON devolucao(data_solicitacao DESC);

COMMENT ON TABLE devolucao IS 'Armazena solicitações de devolução de pedidos';
COMMENT ON COLUMN devolucao.status IS 'Status da devolução: PENDENTE, APROVADA, REJEITADA, CONCLUIDA';
COMMENT ON TABLE devolucao_imagem IS 'Imagens enviadas pelo cliente na solicitação de devolução';