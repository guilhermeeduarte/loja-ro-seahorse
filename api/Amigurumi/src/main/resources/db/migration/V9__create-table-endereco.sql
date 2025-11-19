CREATE TABLE endereco (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    apelido VARCHAR(50) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'Brasil',
    estado VARCHAR(2) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    bairro VARCHAR(100),
    rua VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    observacoes VARCHAR(500),
    principal BOOLEAN NOT NULL DEFAULT false,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE INDEX idx_endereco_usuario ON endereco(usuario_id);
CREATE INDEX idx_endereco_principal ON endereco(usuario_id, principal);

COMMENT ON TABLE endereco IS 'Armazena múltiplos endereços de entrega dos usuários';
COMMENT ON COLUMN endereco.apelido IS 'Nome identificador do endereço (ex: Casa, Trabalho)';
COMMENT ON COLUMN endereco.principal IS 'Indica se é o endereço principal do usuário';