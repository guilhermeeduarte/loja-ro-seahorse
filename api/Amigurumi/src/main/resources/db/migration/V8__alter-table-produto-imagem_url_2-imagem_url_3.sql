ALTER TABLE produto
ADD COLUMN IF NOT EXISTS imagem_url_2 VARCHAR(500),
ADD COLUMN IF NOT EXISTS imagem_url_3 VARCHAR(500);

COMMENT ON COLUMN produto.imagem_url IS 'URL da primeira imagem do produto';
COMMENT ON COLUMN produto.imagem_url_2 IS 'URL da segunda imagem do produto (opcional)';
COMMENT ON COLUMN produto.imagem_url_3 IS 'URL da terceira imagem do produto (opcional)';