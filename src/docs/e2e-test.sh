#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — salesmanager-service (puerto 3013)
# Módulos: salesmanagers, salesmanagermerchantcontracts, catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3013/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — SalesManager Microservice — 100% UH + Swagger    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/salesmanagers/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 SalesManager"
P=$(cat <<EOF
{"name":"E2E SM ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"SM-${UNIQUE}","userId":"00000000-0000-0000-0000-000000000001",
 "status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "salesmanagers" "$P"

log_step 2 "UH-2 SalesManagerMerchantContract"
P=$(cat <<EOF
{"name":"E2E SMC ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"SMC-${UNIQUE}","salesmanagerId":"00000000-0000-0000-0000-000000000001",
 "merchantId":"00000000-0000-0000-0000-000000000002","status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "salesmanagermerchantcontracts" "$P"

log_step 3 "UH-3 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"risk-level","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 4 "UH-4 catalog-client"
smoke_catalog_client

log_step 5 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*salesmanager[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics salesmanager.* detectados"; else log_warn "Sin topics salesmanager.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "salesmanager-service"
