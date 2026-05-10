import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type SalesmanagerLifecycleRow = {
  id: string;
  name: string;
  contractCode: string | null;
  salesManagerId: string | null;
  merchantId: string | null;
  status: string | null;
  commissionMode: string | null;
  commissionValue: number;
  startsAt: string | null;
  endsAt: string | null;
  allowsReferralCommissions: boolean;
  creationDate: string | null;
  modificationDate: string | null;
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
            contractsWithReferral: 0,
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
         COUNT(*)::int AS "totalContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, 'DRAFT')) = 'DRAFT')::int AS "draftContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'ACTIVE')::int AS "activeContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) IN ('SUSPENDED', 'PAUSED'))::int AS "suspendedContracts",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'EXPIRED')::int AS "expiredContracts",
         COUNT(*) FILTER (WHERE COALESCE("allowsReferralCommissions", false) = true)::int AS "contractsWithReferral",
         COUNT(*) FILTER (
           WHERE COALESCE("startsAt", NOW()) <= NOW()
             AND ("endsAt" IS NULL OR "endsAt" >= NOW())
             AND UPPER(COALESCE(status, '')) IN ('ACTIVE', 'CONFIRMED')
         )::int AS "currentlyEffectiveContracts"
       FROM salesmanager_merchant_contract_base_entity
       WHERE COALESCE("isActive", true) = true
         AND type = 'salesmanagermerchantcontract'`,
    );

    const [modeTotals] = await dataSource.query(
      `SELECT
         (SELECT COUNT(*)::int FROM commission_mode_base_entity WHERE COALESCE("isActive", true) = true AND type = 'commissionmode') AS "commissionModesConfigured",
         (SELECT COUNT(*)::int FROM salesmanager_merchant_contract_status_base_entity WHERE COALESCE("isActive", true) = true AND type = 'salesmanagermerchantcontractstatus') AS "contractStatusesConfigured"`,
    );

    const latest = await dataSource.query(
      `SELECT id, name, "contractCode", "salesManagerId", "merchantId", status, "commissionMode",
              COALESCE("commissionValue", 0)::float AS "commissionValue", "startsAt", "endsAt",
              COALESCE("allowsReferralCommissions", false) AS "allowsReferralCommissions",
              "creationDate", "modificationDate"
       FROM salesmanager_merchant_contract_base_entity
       WHERE COALESCE("isActive", true) = true
         AND type = 'salesmanagermerchantcontract'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
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
          contractsWithReferral: Number(contractTotals?.contractsWithReferral ?? 0),
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

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }
}