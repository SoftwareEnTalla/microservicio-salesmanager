-- ====================================================================
-- salesmanager_merchant_contract_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "salesmanager_merchant_contract_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DRAFT', 'Draft', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus'),
  ('PENDING', 'Pending', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus'),
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus'),
  ('TERMINATED', 'Terminated', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus'),
  ('EXPIRED', 'Expired', '', '{}'::jsonb, 'system', TRUE, 'salesmanagermerchantcontractstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
