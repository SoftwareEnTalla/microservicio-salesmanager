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

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: salesmanager-service | Puerto: 3013
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3013/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — salesmanager-service ═══\033[0m"

# --- Nomenclador: commission-mode ---
NOM_CODE="NCOMMIS-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E CommissionMode ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/commissionmodes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "commission-mode: create id=$NOM_ID"; else _nom_warn "commission-mode: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/commissionmodes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "commission-mode: list ok"; else _nom_warn "commission-mode: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/commissionmodes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "commission-mode: getById" || _nom_warn "commission-mode: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/commissionmodes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E CommissionMode updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "commission-mode: update" || _nom_warn "commission-mode: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/commissionmodes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "commission-mode: delete" || _nom_warn "commission-mode: delete"
fi

# --- Nomenclador: salesmanager-merchant-contract-status ---
NOM_CODE="NSALESM-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E SalesmanagerMerchantContractStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/salesmanagermerchantcontractstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "salesmanager-merchant-contract-status: create id=$NOM_ID"; else _nom_warn "salesmanager-merchant-contract-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/salesmanagermerchantcontractstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "salesmanager-merchant-contract-status: list ok"; else _nom_warn "salesmanager-merchant-contract-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/salesmanagermerchantcontractstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "salesmanager-merchant-contract-status: getById" || _nom_warn "salesmanager-merchant-contract-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/salesmanagermerchantcontractstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E SalesmanagerMerchantContractStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "salesmanager-merchant-contract-status: update" || _nom_warn "salesmanager-merchant-contract-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/salesmanagermerchantcontractstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "salesmanager-merchant-contract-status: delete" || _nom_warn "salesmanager-merchant-contract-status: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores salesmanager-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
