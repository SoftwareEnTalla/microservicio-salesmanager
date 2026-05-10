import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesmanagerLifecycleController } from './salesmanager-lifecycle.controller';
import { SalesmanagerLifecycleService } from './salesmanager-lifecycle.service';

@Module({
  imports: [ConfigModule],
  controllers: [SalesmanagerLifecycleController],
  providers: [SalesmanagerLifecycleService],
  exports: [SalesmanagerLifecycleService],
})
export class SalesmanagerLifecycleModule {}