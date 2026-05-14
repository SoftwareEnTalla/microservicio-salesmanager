import { Controller, Get, Query } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SalesmanagerLifecycleService } from './salesmanager-lifecycle.service';

@ApiTags('salesmanager-lifecycle')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('salesmanager-lifecycle')
export class SalesmanagerLifecycleController {
  constructor(private readonly service: SalesmanagerLifecycleService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen agregado de contratos y comisiones de salesmanager' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de salesmanager.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 8));
  }

  @Get('merchant/:merchantId/commercial-policy')
  async getCommercialPolicySnapshotByMerchant(@Param('merchantId') merchantId: string): Promise<Record<string, unknown>> {
    return this.service.getCommercialPolicySnapshotByMerchant(merchantId);
  }

  @Get('contract/:contractId/commercial-policy')
  async getCommercialPolicySnapshotByContract(@Param('contractId') contractId: string): Promise<Record<string, unknown>> {
    return this.service.getCommercialPolicySnapshotByContract(contractId);
  }
}