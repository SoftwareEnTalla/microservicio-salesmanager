import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type SalesmanagerLifecycleRow = {
  id: string;
  name: string;
  contractCode: string | null;
  salesManagerId: string | null;
  userId: string | null;
  managerCode: string | null;
  merchantId: string | null;
  status: string | null;
  approvalStatus: string | null;
  commissionMode: string | null;
  commissionValue: number;
  commissionPlanId: string | null;
  referralTreeReference: string | null;
  contractSnapshotVersion: string | null;
  termsSummary: string | null;
  startsAt: string | null;
  endsAt: string | null;
  allowsReferralCommissions: boolean;
  maxReferralLevels: number;
  rankPolicyCode: string | null;
  retentionPolicy: string | null;
  commissionLevelMatrix: Record<string, unknown> | null;
  creationDate: string | null;
  modificationDate: string | null;
};

type CommercialPolicySnapshotRow = SalesmanagerLifecycleRow & {
  metadata: Record<string, unknown> | null;
  salesManagerMetadata: Record<string, unknown> | null;
};

@Injectable()
export class SalesmanagerLifecycleService {
  constructor(
    @Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined,
  ) {}

  async getSummary(limit: number = 8): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return {
        ok: true,
        message: 'Resumen táctico de salesmanager obtenido con éxito.',
        data: {
          totals: {
            totalContracts: 0,
            draftContracts: 0,
            activeContracts: 0,
            suspendedContracts: 0,
            expiredContracts: 0,
            commerciallyApprovedContracts: 0,
            contractsWithReferral: 0,
            multilevelContracts: 0,
            contractsWithRankPolicy: 0,
            contractsLinkedToCommissionPlan: 0,
            contractsLinkedToReferralTree: 0,
            contractsReadyForLiquidation: 0,
            contractsPendingCommercialPolicy: 0,
            currentlyEffectiveContracts: 0,
            commissionModesConfigured: 0,
            contractStatusesConfigured: 0,
            activationRatePercent: 0,
          },
          latest: [],
        },
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 20));
    const [contractTotals] = await dataSource.query(
      `SELECT
         COUNT(contract.id)::int AS "totalContracts",
         COUNT(contract.id) FILTER (WHERE UPPER(COALESCE(contract.status, 'DRAFT')) = 'DRAFT')::int AS "draftContracts",
         COUNT(contract.id) FILTER (WHERE UPPER(COALESCE(contract.status, '')) = 'ACTIVE')::int AS "activeContracts",
         COUNT(contract.id) FILTER (WHERE UPPER(COALESCE(contract.status, '')) IN ('SUSPENDED', 'PAUSED'))::int AS "suspendedContracts",
         COUNT(contract.id) FILTER (WHERE UPPER(COALESCE(contract.status, '')) = 'EXPIRED')::int AS "expiredContracts",
         COUNT(contract.id) FILTER (WHERE UPPER(COALESCE(sm."approvalStatus", '')) IN ('APPROVED', 'ACTIVE', 'ENABLED'))::int AS "commerciallyApprovedContracts",
         COUNT(contract.id) FILTER (WHERE COALESCE(contract."allowsReferralCommissions", false) = true)::int AS "contractsWithReferral",
         COUNT(contract.id) FILTER (WHERE COALESCE(contract."maxReferralLevels", 1) > 1)::int AS "multilevelContracts",
         COUNT(contract.id) FILTER (WHERE COALESCE(NULLIF(contract."rankPolicyCode", ''), '') <> '')::int AS "contractsWithRankPolicy",
         COUNT(contract.id) FILTER (WHERE contract."commissionMode" IS NOT NULL AND sm."commissionPlanId" IS NOT NULL)::int AS "contractsLinkedToCommissionPlan",
         COUNT(contract.id) FILTER (WHERE COALESCE(NULLIF(sm."referralTreeReference", ''), '') <> '')::int AS "contractsLinkedToReferralTree",
         COUNT(contract.id) FILTER (
           WHERE UPPER(COALESCE(sm."approvalStatus", '')) IN ('APPROVED', 'ACTIVE', 'ENABLED')
             AND contract."commissionMode" IS NOT NULL
             AND sm."commissionPlanId" IS NOT NULL
             AND COALESCE(NULLIF(sm."referralTreeReference", ''), '') <> ''
         )::int AS "contractsReadyForLiquidation",
         COUNT(contract.id) FILTER (
           WHERE UPPER(COALESCE(sm."approvalStatus", 'DRAFT')) NOT IN ('APPROVED', 'ACTIVE', 'ENABLED')
              OR contract."commissionMode" IS NULL
              OR sm."commissionPlanId" IS NULL
              OR COALESCE(NULLIF(sm."referralTreeReference", ''), '') = ''
         )::int AS "contractsPendingCommercialPolicy",
         COUNT(contract.id) FILTER (
           WHERE COALESCE(contract."startsAt", NOW()) <= NOW()
             AND (contract."endsAt" IS NULL OR contract."endsAt" >= NOW())
             AND UPPER(COALESCE(contract.status, '')) IN ('ACTIVE', 'CONFIRMED')
         )::int AS "currentlyEffectiveContracts"
       FROM salesmanager_merchant_contract_base_entity contract
       LEFT JOIN salesmanager_base_entity sm
         ON sm.id = contract."salesManagerId"
        AND COALESCE(sm."isActive", true) = true
        AND sm.type = 'salesmanager'
       WHERE COALESCE(contract."isActive", true) = true
         AND contract.type = 'salesmanagermerchantcontract'`,
    );

    const [modeTotals] = await dataSource.query(
      `SELECT
         (SELECT COUNT(*)::int FROM commission_mode_base_entity WHERE COALESCE("isActive", true) = true AND type = 'commissionmode') AS "commissionModesConfigured",
         (SELECT COUNT(*)::int FROM salesmanager_merchant_contract_status_base_entity WHERE COALESCE("isActive", true) = true AND type = 'salesmanagermerchantcontractstatus') AS "contractStatusesConfigured"`,
    );

    const latest = await dataSource.query(
      `SELECT contract.id, contract.name, contract."contractCode", contract."salesManagerId", sm."userId", sm."managerCode", contract."merchantId",
              contract.status, sm."approvalStatus", contract."commissionMode",
              COALESCE(contract."commissionValue", 0)::float AS "commissionValue",
              sm."commissionPlanId", sm."referralTreeReference",
              COALESCE(
                NULLIF(contract.metadata::jsonb ->> 'contractSnapshotVersion', ''),
                NULLIF(sm.metadata::jsonb ->> 'commissionSnapshotVersion', ''),
                CONCAT(
                  'sales-',
                  COALESCE(sm."commissionPlanId"::text, 'na'),
                  '-',
                  COALESCE(NULLIF(sm."referralTreeReference", ''), 'no-referral'),
                  '-',
                  COALESCE(contract."commissionMode", 'PERCENTAGE')
                )
              ) AS "contractSnapshotVersion",
              NULLIF(contract."termsSummary", '') AS "termsSummary",
              contract."startsAt", contract."endsAt",
              COALESCE(contract."allowsReferralCommissions", false) AS "allowsReferralCommissions",
              COALESCE(contract."maxReferralLevels", 1)::int AS "maxReferralLevels",
              NULLIF(contract."rankPolicyCode", '') AS "rankPolicyCode",
              NULLIF(contract."retentionPolicy", '') AS "retentionPolicy",
              contract."commissionLevelMatrix" AS "commissionLevelMatrix",
              contract."creationDate", contract."modificationDate"
       FROM salesmanager_merchant_contract_base_entity contract
       LEFT JOIN salesmanager_base_entity sm
         ON sm.id = contract."salesManagerId"
        AND COALESCE(sm."isActive", true) = true
        AND sm.type = 'salesmanager'
       WHERE COALESCE(contract."isActive", true) = true
         AND contract.type = 'salesmanagermerchantcontract'
       ORDER BY COALESCE(contract."modificationDate", contract."creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const totalContracts = Number(contractTotals?.totalContracts ?? 0);
    const activeContracts = Number(contractTotals?.activeContracts ?? 0);

    return {
      ok: true,
      message: 'Resumen táctico de salesmanager obtenido con éxito.',
      data: {
        totals: {
          totalContracts,
          draftContracts: Number(contractTotals?.draftContracts ?? 0),
          activeContracts,
          suspendedContracts: Number(contractTotals?.suspendedContracts ?? 0),
          expiredContracts: Number(contractTotals?.expiredContracts ?? 0),
          commerciallyApprovedContracts: Number(contractTotals?.commerciallyApprovedContracts ?? 0),
          contractsWithReferral: Number(contractTotals?.contractsWithReferral ?? 0),
          multilevelContracts: Number(contractTotals?.multilevelContracts ?? 0),
          contractsWithRankPolicy: Number(contractTotals?.contractsWithRankPolicy ?? 0),
          contractsLinkedToCommissionPlan: Number(contractTotals?.contractsLinkedToCommissionPlan ?? 0),
          contractsLinkedToReferralTree: Number(contractTotals?.contractsLinkedToReferralTree ?? 0),
          contractsReadyForLiquidation: Number(contractTotals?.contractsReadyForLiquidation ?? 0),
          contractsPendingCommercialPolicy: Number(contractTotals?.contractsPendingCommercialPolicy ?? 0),
          currentlyEffectiveContracts: Number(contractTotals?.currentlyEffectiveContracts ?? 0),
          commissionModesConfigured: Number(modeTotals?.commissionModesConfigured ?? 0),
          contractStatusesConfigured: Number(modeTotals?.contractStatusesConfigured ?? 0),
          activationRatePercent: totalContracts > 0 ? Math.round((activeContracts / totalContracts) * 100) : 0,
        },
        latest: latest as SalesmanagerLifecycleRow[],
      },
      count: Array.isArray(latest) ? latest.length : 0,
    };
  }

  async getCommercialPolicySnapshotByMerchant(merchantId: string): Promise<Record<string, unknown>> {
    const snapshot = await this.findCommercialPolicySnapshot('contract."merchantId" = $1', [merchantId]);
    if (!snapshot) {
      return {
        ok: false,
        message: `No existe snapshot comercial para merchant ${merchantId}.`,
        data: null,
      };
    }

    return {
      ok: true,
      message: 'Snapshot comercial obtenido con éxito.',
      data: this.mapCommercialPolicySnapshot(snapshot),
    };
  }

  async getCommercialPolicySnapshotByContract(contractId: string): Promise<Record<string, unknown>> {
    const snapshot = await this.findCommercialPolicySnapshot('contract.id = $1', [contractId]);
    if (!snapshot) {
      return {
        ok: false,
        message: `No existe snapshot comercial para contract ${contractId}.`,
        data: null,
      };
    }

    return {
      ok: true,
      message: 'Snapshot comercial obtenido con éxito.',
      data: this.mapCommercialPolicySnapshot(snapshot),
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }

  private async findCommercialPolicySnapshot(
    filterSql: string,
    params: unknown[],
  ): Promise<CommercialPolicySnapshotRow | null> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return null;
    }

    const rows = await dataSource.query(
      `SELECT contract.id, contract.name, contract."contractCode", contract."salesManagerId", sm."userId", sm."managerCode", contract."merchantId",
              contract.status, sm."approvalStatus", contract."commissionMode",
              COALESCE(contract."commissionValue", 0)::float AS "commissionValue",
              sm."commissionPlanId", sm."referralTreeReference",
              COALESCE(
                NULLIF(contract.metadata::jsonb ->> 'contractSnapshotVersion', ''),
                NULLIF(sm.metadata::jsonb ->> 'commissionSnapshotVersion', ''),
                CONCAT(
                  'sales-',
                  COALESCE(sm."commissionPlanId"::text, 'na'),
                  '-',
                  COALESCE(NULLIF(sm."referralTreeReference", ''), 'no-referral'),
                  '-',
                  COALESCE(contract."commissionMode", 'PERCENTAGE')
                )
              ) AS "contractSnapshotVersion",
              NULLIF(contract."termsSummary", '') AS "termsSummary",
              contract."startsAt", contract."endsAt",
              COALESCE(contract."allowsReferralCommissions", false) AS "allowsReferralCommissions",
              COALESCE(contract."maxReferralLevels", 1)::int AS "maxReferralLevels",
              NULLIF(contract."rankPolicyCode", '') AS "rankPolicyCode",
              NULLIF(contract."retentionPolicy", '') AS "retentionPolicy",
              contract."commissionLevelMatrix" AS "commissionLevelMatrix",
              contract.metadata AS metadata,
              sm.metadata AS "salesManagerMetadata",
              contract."creationDate", contract."modificationDate"
       FROM salesmanager_merchant_contract_base_entity contract
       LEFT JOIN salesmanager_base_entity sm
         ON sm.id = contract."salesManagerId"
        AND COALESCE(sm."isActive", true) = true
        AND sm.type = 'salesmanager'
       WHERE COALESCE(contract."isActive", true) = true
         AND contract.type = 'salesmanagermerchantcontract'
         AND ${filterSql}
       ORDER BY
         CASE
           WHEN COALESCE(contract."startsAt", NOW()) <= NOW()
            AND (contract."endsAt" IS NULL OR contract."endsAt" >= NOW())
            AND UPPER(COALESCE(contract.status, '')) IN ('ACTIVE', 'CONFIRMED') THEN 0
           WHEN UPPER(COALESCE(contract.status, '')) = 'ACTIVE' THEN 1
           WHEN UPPER(COALESCE(contract.status, '')) = 'CONFIRMED' THEN 2
           ELSE 3
         END,
         COALESCE(contract."modificationDate", contract."creationDate") DESC
       LIMIT 1`,
      params,
    );

    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as CommercialPolicySnapshotRow) : null;
  }

  private mapCommercialPolicySnapshot(row: CommercialPolicySnapshotRow): Record<string, unknown> {
    const contractMetadata = this.asRecord(row.metadata);
    const salesManagerMetadata = this.asRecord(row.salesManagerMetadata);
    const commissionLevelMatrix = this.asRecord(row.commissionLevelMatrix);
    const rankPolicy = this.asRecord(contractMetadata.rankPolicy ?? salesManagerMetadata.rankPolicy ?? null);
    const paymentAutomation = this.asRecord(contractMetadata.paymentAutomation);
    const invoiceAutomation = this.asRecord(contractMetadata.invoiceAutomation);
    const startsAt = this.toIsoString(row.startsAt);
    const endsAt = this.toIsoString(row.endsAt);
    const currentlyEffective = this.isCurrentlyEffective(row.status, row.startsAt, row.endsAt);
    const commerciallyApproved = ['APPROVED', 'ACTIVE', 'ENABLED'].includes(String(row.approvalStatus || '').toUpperCase());
    const commissionPlanId = row.commissionPlanId || String(salesManagerMetadata.commissionPlanId || '') || null;
    const referralTreeReference = row.referralTreeReference || String(salesManagerMetadata.referralTreeReference || '') || null;
    const contractSnapshotVersion = row.contractSnapshotVersion || `sales-${row.id}`;
    const readyForPayment = commerciallyApproved && currentlyEffective && !!commissionPlanId;
    const readyForInvoice = commerciallyApproved && currentlyEffective;

    return {
      contractId: row.id,
      contractCode: row.contractCode,
      merchantId: row.merchantId,
      salesManagerId: row.salesManagerId,
      userId: row.userId,
      managerCode: row.managerCode,
      contractStatus: row.status,
      approvalStatus: row.approvalStatus,
      policyVersion: contractSnapshotVersion,
      contractSnapshotVersion,
      commissionPlanId,
      referralTreeReference,
      commissionMode: row.commissionMode,
      commissionValue: Number(row.commissionValue ?? 0),
      allowsReferralCommissions: Boolean(row.allowsReferralCommissions),
      maxReferralLevels: Number(row.maxReferralLevels ?? 1),
      rankPolicyCode: row.rankPolicyCode || null,
      retentionPolicy: row.retentionPolicy || null,
      commissionLevelMatrix,
      rankPolicy,
      termsSummary: row.termsSummary || null,
      lifecycle: {
        startsAt,
        endsAt,
        currentlyEffective,
      },
      integrations: {
        payment: {
          ready: readyForPayment,
          autoApproveSettlement: Boolean(paymentAutomation.autoApproveSettlement ?? false),
          payoutReferenceScope: paymentAutomation.payoutReferenceScope ?? 'merchant',
        },
        invoice: {
          ready: readyForInvoice,
          autoCloseContract: Boolean(invoiceAutomation.autoCloseContract ?? false),
          invoiceTemplateCode: invoiceAutomation.invoiceTemplateCode ?? null,
        },
      },
      metadata: {
        contract: contractMetadata,
        salesManager: salesManagerMetadata,
      },
    };
  }

  private asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value as Record<string, unknown>;
  }

  private toIsoString(value: string | null): string | null {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  private isCurrentlyEffective(status: string | null, startsAt: string | null, endsAt: string | null): boolean {
    const normalizedStatus = String(status || '').toUpperCase();
    if (!['ACTIVE', 'CONFIRMED'].includes(normalizedStatus)) {
      return false;
    }

    const now = Date.now();
    const startsAtTime = startsAt ? new Date(startsAt).getTime() : now;
    const endsAtTime = endsAt ? new Date(endsAt).getTime() : null;

    if (Number.isNaN(startsAtTime)) {
      return false;
    }

    return startsAtTime <= now && (endsAtTime === null || (!Number.isNaN(endsAtTime) && endsAtTime >= now));
  }
}