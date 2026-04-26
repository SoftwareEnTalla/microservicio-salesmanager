/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Module } from "@nestjs/common";
import { SalesmanagerMerchantContractStatusCommandController } from "../controllers/salesmanagermerchantcontractstatuscommand.controller";
import { SalesmanagerMerchantContractStatusQueryController } from "../controllers/salesmanagermerchantcontractstatusquery.controller";
import { SalesmanagerMerchantContractStatusCommandService } from "../services/salesmanagermerchantcontractstatuscommand.service";
import { SalesmanagerMerchantContractStatusQueryService } from "../services/salesmanagermerchantcontractstatusquery.service";

import { SalesmanagerMerchantContractStatusCommandRepository } from "../repositories/salesmanagermerchantcontractstatuscommand.repository";
import { SalesmanagerMerchantContractStatusQueryRepository } from "../repositories/salesmanagermerchantcontractstatusquery.repository";
import { SalesmanagerMerchantContractStatusRepository } from "../repositories/salesmanagermerchantcontractstatus.repository";
import { SalesmanagerMerchantContractStatusResolver } from "../graphql/salesmanagermerchantcontractstatus.resolver";
import { SalesmanagerMerchantContractStatusAuthGuard } from "../guards/salesmanagermerchantcontractstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalesmanagerMerchantContractStatus } from "../entities/salesmanager-merchant-contract-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSalesmanagerMerchantContractStatusHandler } from "../commands/handlers/createsalesmanagermerchantcontractstatus.handler";
import { UpdateSalesmanagerMerchantContractStatusHandler } from "../commands/handlers/updatesalesmanagermerchantcontractstatus.handler";
import { DeleteSalesmanagerMerchantContractStatusHandler } from "../commands/handlers/deletesalesmanagermerchantcontractstatus.handler";
import { GetSalesmanagerMerchantContractStatusByIdHandler } from "../queries/handlers/getsalesmanagermerchantcontractstatusbyid.handler";
import { GetSalesmanagerMerchantContractStatusByFieldHandler } from "../queries/handlers/getsalesmanagermerchantcontractstatusbyfield.handler";
import { GetAllSalesmanagerMerchantContractStatusHandler } from "../queries/handlers/getallsalesmanagermerchantcontractstatus.handler";
import { SalesmanagerMerchantContractStatusCrudSaga } from "../sagas/salesmanagermerchantcontractstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SalesmanagerMerchantContractStatusInterceptor } from "../interceptors/salesmanagermerchantcontractstatus.interceptor";
import { SalesmanagerMerchantContractStatusLoggingInterceptor } from "../interceptors/salesmanagermerchantcontractstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, SalesmanagerMerchantContractStatus]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [SalesmanagerMerchantContractStatusCommandController, SalesmanagerMerchantContractStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    SalesmanagerMerchantContractStatusQueryService,
    SalesmanagerMerchantContractStatusCommandService,
  
    //Repositories
    SalesmanagerMerchantContractStatusCommandRepository,
    SalesmanagerMerchantContractStatusQueryRepository,
    SalesmanagerMerchantContractStatusRepository,      
    //Resolvers
    SalesmanagerMerchantContractStatusResolver,
    //Guards
    SalesmanagerMerchantContractStatusAuthGuard,
    //Interceptors
    SalesmanagerMerchantContractStatusInterceptor,
    SalesmanagerMerchantContractStatusLoggingInterceptor,
    //CQRS Handlers
    CreateSalesmanagerMerchantContractStatusHandler,
    UpdateSalesmanagerMerchantContractStatusHandler,
    DeleteSalesmanagerMerchantContractStatusHandler,
    GetSalesmanagerMerchantContractStatusByIdHandler,
    GetSalesmanagerMerchantContractStatusByFieldHandler,
    GetAllSalesmanagerMerchantContractStatusHandler,
    SalesmanagerMerchantContractStatusCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    SalesmanagerMerchantContractStatusQueryService,
    SalesmanagerMerchantContractStatusCommandService,
  
    //Repositories
    SalesmanagerMerchantContractStatusCommandRepository,
    SalesmanagerMerchantContractStatusQueryRepository,
    SalesmanagerMerchantContractStatusRepository,      
    //Resolvers
    SalesmanagerMerchantContractStatusResolver,
    //Guards
    SalesmanagerMerchantContractStatusAuthGuard,
    //Interceptors
    SalesmanagerMerchantContractStatusInterceptor,
    SalesmanagerMerchantContractStatusLoggingInterceptor,
  ],
})
export class SalesmanagerMerchantContractStatusModule {}

