CREATE TABLE lista_desejo (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, produto_id)
);

CREATE INDEX idx_lista_desejo_usuario ON lista_desejo(usuario_id);
CREATE INDEX idx_lista_desejo_produto ON lista_desejo(produto_id);