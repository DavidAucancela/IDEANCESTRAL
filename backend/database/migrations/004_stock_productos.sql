-- =============================================================================
-- Migración 004: Stock de productos
-- =============================================================================
-- stock NULL = no se controla stock (pieza bajo pedido o sin inventario fijo).
-- stock 0    = agotado.
-- Idempotente: se puede ejecutar en cada deploy.
-- =============================================================================

ALTER TABLE productos ADD COLUMN IF NOT EXISTS stock INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'productos_stock_no_negativo') THEN
    ALTER TABLE productos ADD CONSTRAINT productos_stock_no_negativo CHECK (stock IS NULL OR stock >= 0);
  END IF;
END $$;
