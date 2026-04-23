# SalesManager Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3013
> **Base URL**: `http://localhost:3013/api`
> **Swagger UI**: `http://localhost:3013/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: SalesManager

El microservicio **salesmanager** gestiona la **especialización comercial** de `user`: gestores de ventas, sus planes de comisión, árbol de referidos, y los **contratos operativos con merchants** (comisiones FIXED/PERCENTAGE/TIERED/MIXED, vigencias, referidos). Desacopla el dominio comercial del security-service.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Gestión de sales managers (código, plan de comisión, aprobación, referral-tree) | salesmanager |
| UH-2 | Contratos operativos SalesManager ↔ Merchant (comisiones, vigencia, referidos) | salesmanager-merchant-contract |
| UH-3 | Trazabilidad de sincronizaciones con catalog-service | catalog-sync-log |
| UH-4 | Integración con catalog-service | catalog-client |

### UH-2 — SalesManager-Merchant Contract

**Como** sales manager, **quiero** firmar un contrato operativo con un merchant definiendo modo y valor de comisión, vigencia y habilitación de comisiones por referidos **para** recibir pagos por la operación comercial generada.

---

## 2. Modelo DSL

Los modelos están en `models/salesmanager/`.

| Modelo XML | Versión | AggregateRoot | ModuleType | Descripción |
|------------|---------|:---:|---|---|
| `salesmanager.xml` | 1.0.0 | ✓ | aggregate-root | Gestor comercial (referencia a user) |
| `salesmanager-merchant-contract.xml` | 1.0.0 | ✗ | entity | Contrato con merchant |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity | Trazabilidad sync catalog |

### Estructura de un modelo DSL

```xml
<domain-model name="salesmanager-merchant-contract" schemaVersion="2.0" version="1.0.0"
              boundedContext="salesmanager" aggregateRoot="false" moduleType="entity">
  <fields>
    <field name="salesManagerId" type="uuid"/>
    <field name="merchantId" type="uuid"/>
    <field name="contractCode" type="string" unique="true"/>
    <field name="status" type="string" defaultValue="DRAFT"/>
    <field name="commissionMode" type="string" defaultValue="PERCENTAGE"/>
    <field name="commissionValue" type="decimal" precision="12" scale="2"/>
    <field name="allowsReferralCommissions" type="boolean"/>
  </fields>
</domain-model>
```

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados en controllers, services, repos. |
| **Event Sourcing** | Eventos en EventStore + Kafka. |
| **Event-Driven** | Eventos `salesmanager-*` consumidos por security-service para mantener proyección `sales-manager`. |
| **Saga Pattern** | CRUD sagas por módulo. |
| **DDD** | Aggregates *SalesManager*, *SalesManagerMerchantContract*. |
| **Catalog-fallback** | Breaker + cache TTL 5 min. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│           SALESMANAGER MICROSERVICE  (3013)                │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│        │              │              │                     │
│   CommandBus      QueryBus      Resolvers                  │
│        │              │                                    │
│   Service ↔ Repository → PostgreSQL (salesmanager-service) │
│                                                            │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│                         │                                  │
│                   CatalogClient (breaker + cache)          │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ (base.event, *.event, event-registry.ts)
├── graphql/ guards/ interceptors/ modules/ queries/
├── repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

### 4.1 SalesManager
- **Entidad**: `SalesManager` — `userId` (unique), `managerCode` (unique), `approvalStatus` (DRAFT/PENDING/APPROVED/REJECTED/SUSPENDED), `commissionPlanId`, `referralTreeReference`, `metadata`.

### 4.2 SalesManagerMerchantContract
- **Entidad**: `SalesManagerMerchantContract` — `contractCode` (unique), `salesManagerId`, `merchantId`, `status` (DRAFT/PENDING/ACTIVE/SUSPENDED/TERMINATED/EXPIRED), `commissionMode` (FIXED/PERCENTAGE/TIERED/MIXED), `commissionValue`, `startsAt`, `endsAt`, `allowsReferralCommissions`, `termsSummary`, `metadata`.

### 4.3 CatalogSyncLog
- **Entidad**: trazabilidad de sync con catalog (categoryCode, triggeredBy, outcome, diffSnapshot, syncedAt).

### 4.4 CatalogClient
- `CatalogClientService`, `CatalogSyncService`, `CatalogKafkaConsumer`, `CatalogSyncController` (`/api/catalog-sync/health|status|run`).

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión | Replayable |
|--------|--------|--------------|---------|:---:|
| salesmanager | `SalesManagerCreatedEvent` | `salesmanager-created` | 1.0.0 | ✓ |
| salesmanager | `SalesManagerUpdatedEvent` | `salesmanager-updated` | 1.0.0 | ✓ |
| salesmanager | `SalesManagerDeletedEvent` | `salesmanager-deleted` | 1.0.0 | ✓ |
| salesmanager-merchant-contract | `SalesManagerMerchantContractCreatedEvent` | `salesmanager-merchant-contract-created` | 1.0.0 | ✓ |
| salesmanager-merchant-contract | `SalesManagerMerchantContractUpdatedEvent` | `salesmanager-merchant-contract-updated` | 1.0.0 | ✓ |
| salesmanager-merchant-contract | `SalesManagerMerchantContractDeletedEvent` | `salesmanager-merchant-contract-deleted` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogCreatedEvent` | `catalog-sync-log-created` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogUpdatedEvent` | `catalog-sync-log-updated` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogDeletedEvent` | `catalog-sync-log-deleted` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncCompletedEvent` | `catalog-sync-completed` | 1.0.0 | ✗ |
| catalog-sync-log | `CatalogSyncFailedEvent` | `catalog-sync-failed` | 1.0.0 | ✗ |

Cada topic genera `<topic>-retry` y `<topic>-dlq`.

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* SalesManager / SalesManagerMerchantContract */ },
    "metadata": {
      "initiatedBy": "user-id", "correlationId": "uuid",
      "eventName": "SalesManagerCreatedEvent", "eventVersion": "1.0.0",
      "sourceService": "salesmanager-service", "retryCount": 0,
      "idempotencyKey": "uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory |
| * (sagas CRUD) | `SalesManager*Event`, `SalesManagerMerchantContract*Event` | self (EventBus) | Hook post-CRUD |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica con TTL.

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD (todos los módulos)

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/<entities>/command` | `CreateXxxDto` |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` |
| DELETE | `/api/<entities>/command/:id` | — |
| DELETE | `/api/<entities>/command/bulk` | — |

### 7.2 Query CRUD

| Método | Ruta | Query Params |
|--------|------|--------------|
| GET | `/api/<entities>/query/list` | `page, size, sort, order, search, initDate, endDate` |
| GET | `/api/<entities>/query/:id` | — |
| GET | `/api/<entities>/query/field/:field` | `value, page, size` |
| GET | `/api/<entities>/query/pagination` | `page, size` |
| GET | `/api/<entities>/query/count` | — |
| GET | `/api/<entities>/query/search` | `where` |
| GET | `/api/<entities>/query/find-one` | `where` |
| GET | `/api/<entities>/query/find-one-or-fail` | `where` |

### 7.3 Prefijos por módulo

| Módulo | Prefijo Command | Prefijo Query | Auth |
|--------|-----------------|---------------|:---:|
| salesmanager | `/api/salesmanagers/command` | `/api/salesmanagers/query` | Bearer |
| salesmanager-merchant-contract | `/api/salesmanagermerchantcontracts/command` | `/api/salesmanagermerchantcontracts/query` | Bearer |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` | Bearer |
| catalog-client | `/api/catalog-sync` | — | — |

### 7.4 DTOs principales

```json
// CreateSalesManagerDto
{ "userId":"UUID", "managerCode":"SM-001", "approvalStatus":"PENDING",
  "commissionPlanId":"UUID", "referralTreeReference":"REF-TREE-001" }

// CreateSalesManagerMerchantContractDto
{ "contractCode":"C-2026-001", "salesManagerId":"UUID", "merchantId":"UUID",
  "status":"DRAFT", "commissionMode":"PERCENTAGE", "commissionValue":2.5,
  "startsAt":"2026-05-01T00:00:00Z", "allowsReferralCommissions":true }
```

---

## 8. Guía para Desarrolladores

### 8.1 Crear un Evento

```typescript
export class SalesManagerCreatedEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<SalesManager>) { super(aggregateId); }
  static create(id, instance, userId, correlationId = uuidv4()) {
    return new SalesManagerCreatedEvent(id, { instance, metadata: { initiatedBy: userId, correlationId } });
  }
}
```

Registrar en `event-registry.ts`; publicar con dual publish (`eventBus.publish` + `eventPublisher.publish`).

### 8.2 Crear una Saga

```typescript
@Injectable()
export class SalesManagerCrudSaga {
  @Saga()
  onCreated = ($e: Observable<SalesManagerCreatedEvent>) => $e.pipe(
    ofType(SalesManagerCreatedEvent),
    tap(e => this.logger.log(`SalesManager created ${e.aggregateId}`)),
    map(() => null),
  );
}
```

---

## 9. Test E2E con curl

```bash
cd salesmanager-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash salesmanager-service/src/docs/e2e-test.sh
```

Cobertura objetivo 100% UH + Swagger + Kafka:

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health + DB baseline | Infra |
| 1 | Crear salesmanager → `salesmanager-created` | `salesmanager` |
| 2 | Update (approvalStatus APPROVED) → `salesmanager-updated` | Kafka produce |
| 3 | Query list + field + pagination | `salesmanager` |
| 4 | Crear contrato → `salesmanager-merchant-contract-created` | `salesmanager-merchant-contract` |
| 5 | Update contrato (status ACTIVE) → `salesmanager-merchant-contract-updated` | Kafka produce |
| 6 | Delete contrato → `salesmanager-merchant-contract-deleted` | Kafka produce |
| 7 | Catalog-sync health + status + run manual | `catalog-client` |
| 8 | GET catalog-sync-log → `catalog-sync-completed` | `catalog-sync-log` |
| 9 | `kcat -L` verifica topics `salesmanager-*` | Kafka probe |
| 10 | Limpieza | Todos |

Requisitos: salesmanager-service ↑, PostgreSQL, `curl` + `jq`; `kcat` opcional.

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

| Módulo | Saga | Handlers |
|--------|------|----------|
| salesmanager | `SalesManagerCrudSaga` | Created/Updated/Deleted |
| salesmanager-merchant-contract | `SalesManagerMerchantContractCrudSaga` | Created/Updated/Deleted |
| catalog-sync-log | `CatalogSyncLogCrudSaga` | Created/Updated/Deleted |

### 10.2 Totales

- **Eventos registrados**: 11 (6 CRUD + 3 sync-log + 2 dominio catalog-sync)
- **Topics Kafka**: 11 main + 11 retry + 11 DLQ = **33**

### 10.3 Dual publish

Requerido para activar sagas `@Saga()` in-process.

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `APP_NAME` / `STAGE` / `PORT` | 3013 |
| `DB_TYPE` / `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` / `DB_NAME` | PostgreSQL |
| `JWT_SECRET` / `API_KEY` / `SA_EMAIL` / `SA_PWD` | Auth |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` / `EVENT_STORE_URL` / `EVENT_STORE_STREAM_PREFIX` | Event sourcing |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_TTL` | Redis |
| `LOG_API_BASE_URL` / `LOG_API_SCOPE` / `LOG_API_CREATE_ACTION` / `LOG_API_AUTH_TOKEN` | Codetrace |
| `LOG_DELIVERY_MODE` / `LOG_KAFKA_TOPIC` | Modo entrega trazas |
| `LOG_EXECUTION_TIME` / `LOG_READY` / `LOG_LEVEL` | Logging |
| `SWAGGER_USER` / `SWAGGER_PWD` | Swagger basic auth |
| `LANDING_APP` / `ADMIN_APP` / `LANG` / `NODE_ENV` | Metadata |

---

## 12. Build & Run

```bash
cd salesmanager-service
npm install && npm run build
node dist/main.js
# o docker-compose up salesmanager-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
