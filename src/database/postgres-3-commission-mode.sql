-- ====================================================================
-- commission_mode_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "commission_mode_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('FIXED', 'Fixed', '', '{}'::jsonb, 'system', TRUE, 'commissionmode'),
  ('PERCENTAGE', 'Percentage', '', '{}'::jsonb, 'system', TRUE, 'commissionmode'),
  ('TIERED', 'Tiered', '', '{}'::jsonb, 'system', TRUE, 'commissionmode'),
  ('MIXED', 'Mixed', '', '{}'::jsonb, 'system', TRUE, 'commissionmode')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
