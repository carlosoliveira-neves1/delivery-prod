-- Adicionar novos campos à tabela companies existente
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(20) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS state_registration VARCHAR(20),
ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255);

-- Atualizar empresas existentes com valores padrão (se necessário)
UPDATE companies SET tax_id = '00000000000' WHERE tax_id = '' OR tax_id IS NULL;
