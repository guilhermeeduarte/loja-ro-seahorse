ALTER TABLE produto ADD COLUMN IF NOT EXISTS imagem_url VARCHAR(500);

CREATE INDEX IF NOT EXISTS idx_produto_categoria ON produto(categoria);
CREATE INDEX IF NOT EXISTS idx_produto_quantidade ON produto(quantidade);