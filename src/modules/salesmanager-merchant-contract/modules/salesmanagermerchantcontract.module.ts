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
import { SalesManagerMerchantContractCommandController } from "../controllers/salesmanagermerchantcontractcommand.controller";
import { SalesManagerMerchantContractQueryController } from "../controllers/salesmanagermerchantcontractquery.controller";
import { SalesManagerMerchantContractCommandService } from "../services/salesmanagermerchantcontractcommand.service";
import { SalesManagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";
import { SalesManagerMerchantContractCommandRepository } from "../repositories/salesmanagermerchantcontractcommand.repository";
import { SalesManagerMerchantContractQueryRepository } from "../repositories/salesmanagermerchantcontractquery.repository";
import { SalesManagerMerchantContractRepository } from "../repositories/salesmanagermerchantcontract.repository";
import { SalesManagerMerchantContractResolver } from "../graphql/salesmanagermerchantcontract.resolver";
import { SalesManagerMerchantContractAuthGuard } from "../guards/salesmanagermerchantcontractauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalesManagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSalesManagerMerchantContractHandler } from "../commands/handlers/createsalesmanagermerchantcontract.handler";
import { UpdateSalesManagerMerchantContractHandler } from "../commands/handlers/updatesalesmanagermerchantcontract.handler";
import { DeleteSalesManagerMerchantContractHandler } from "../commands/handlers/deletesalesmanagermerchantcontract.handler";
import { GetSalesManagerMerchantContractByIdHandler } from "../queries/handlers/getsalesmanagermerchantcontractbyid.handler";
import { GetSalesManagerMerchantContractByFieldHandler } from "../queries/handlers/getsalesmanagermerchantcontractbyfield.handler";
import { GetAllSalesManagerMerchantContractHandler } from "../queries/handlers/getallsalesmanagermerchantcontract.handler";
import { SalesManagerMerchantContractCrudSaga } from "../sagas/salesmanagermerchantcontract-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SalesManagerMerchantContractInterceptor } from "../interceptors/salesmanagermerchantcontract.interceptor";
import { SalesManagerMerchantContractLoggingInterceptor } from "../interceptors/salesmanagermerchantcontract.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, SalesManagerMerchantContract]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [SalesManagerMerchantContractCommandController, SalesManagerMerchantContractQueryController],
  providers: [
    //Services
    EventStoreService,
    SalesManagerMerchantContractQueryService,
    SalesManagerMerchantContractCommandService,
    //Repositories
    SalesManagerMerchantContractCommandRepository,
    SalesManagerMerchantContractQueryRepository,
    SalesManagerMerchantContractRepository,      
    //Resolvers
    SalesManagerMerchantContractResolver,
    //Guards
    SalesManagerMerchantContractAuthGuard,
    //Interceptors
    SalesManagerMerchantContractInterceptor,
    SalesManagerMerchantContractLoggingInterceptor,
    //CQRS Handlers
    CreateSalesManagerMerchantContractHandler,
    UpdateSalesManagerMerchantContractHandler,
    DeleteSalesManagerMerchantContractHandler,
    GetSalesManagerMerchantContractByIdHandler,
    GetSalesManagerMerchantContractByFieldHandler,
    GetAllSalesManagerMerchantContractHandler,
    SalesManagerMerchantContractCrudSaga,
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
    SalesManagerMerchantContractQueryService,
    SalesManagerMerchantContractCommandService,
    //Repositories
    SalesManagerMerchantContractCommandRepository,
    SalesManagerMerchantContractQueryRepository,
    SalesManagerMerchantContractRepository,      
    //Resolvers
    SalesManagerMerchantContractResolver,
    //Guards
    SalesManagerMerchantContractAuthGuard,
    //Interceptors
    SalesManagerMerchantContractInterceptor,
    SalesManagerMerchantContractLoggingInterceptor,
  ],
})
export class SalesManagerMerchantContractModule {}

