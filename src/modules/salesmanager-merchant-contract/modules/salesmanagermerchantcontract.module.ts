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
import { SalesmanagerMerchantContractCommandController } from "../controllers/salesmanagermerchantcontractcommand.controller";
import { SalesmanagerMerchantContractQueryController } from "../controllers/salesmanagermerchantcontractquery.controller";
import { SalesmanagerMerchantContractCommandService } from "../services/salesmanagermerchantcontractcommand.service";
import { SalesmanagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";
import { SalesmanagerMerchantContractCommandRepository } from "../repositories/salesmanagermerchantcontractcommand.repository";
import { SalesmanagerMerchantContractQueryRepository } from "../repositories/salesmanagermerchantcontractquery.repository";
import { SalesmanagerMerchantContractRepository } from "../repositories/salesmanagermerchantcontract.repository";
import { SalesmanagerMerchantContractResolver } from "../graphql/salesmanagermerchantcontract.resolver";
import { SalesmanagerMerchantContractAuthGuard } from "../guards/salesmanagermerchantcontractauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalesmanagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSalesmanagerMerchantContractHandler } from "../commands/handlers/createsalesmanagermerchantcontract.handler";
import { UpdateSalesmanagerMerchantContractHandler } from "../commands/handlers/updatesalesmanagermerchantcontract.handler";
import { DeleteSalesmanagerMerchantContractHandler } from "../commands/handlers/deletesalesmanagermerchantcontract.handler";
import { GetSalesmanagerMerchantContractByIdHandler } from "../queries/handlers/getsalesmanagermerchantcontractbyid.handler";
import { GetSalesmanagerMerchantContractByFieldHandler } from "../queries/handlers/getsalesmanagermerchantcontractbyfield.handler";
import { GetAllSalesmanagerMerchantContractHandler } from "../queries/handlers/getallsalesmanagermerchantcontract.handler";
import { SalesmanagerMerchantContractCrudSaga } from "../sagas/salesmanagermerchantcontract-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SalesmanagerMerchantContractInterceptor } from "../interceptors/salesmanagermerchantcontract.interceptor";
import { SalesmanagerMerchantContractLoggingInterceptor } from "../interceptors/salesmanagermerchantcontract.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, SalesmanagerMerchantContract]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [SalesmanagerMerchantContractCommandController, SalesmanagerMerchantContractQueryController],
  providers: [
    //Services
    EventStoreService,
    SalesmanagerMerchantContractQueryService,
    SalesmanagerMerchantContractCommandService,
    //Repositories
    SalesmanagerMerchantContractCommandRepository,
    SalesmanagerMerchantContractQueryRepository,
    SalesmanagerMerchantContractRepository,      
    //Resolvers
    SalesmanagerMerchantContractResolver,
    //Guards
    SalesmanagerMerchantContractAuthGuard,
    //Interceptors
    SalesmanagerMerchantContractInterceptor,
    SalesmanagerMerchantContractLoggingInterceptor,
    //CQRS Handlers
    CreateSalesmanagerMerchantContractHandler,
    UpdateSalesmanagerMerchantContractHandler,
    DeleteSalesmanagerMerchantContractHandler,
    GetSalesmanagerMerchantContractByIdHandler,
    GetSalesmanagerMerchantContractByFieldHandler,
    GetAllSalesmanagerMerchantContractHandler,
    SalesmanagerMerchantContractCrudSaga,
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
    SalesmanagerMerchantContractQueryService,
    SalesmanagerMerchantContractCommandService,
    //Repositories
    SalesmanagerMerchantContractCommandRepository,
    SalesmanagerMerchantContractQueryRepository,
    SalesmanagerMerchantContractRepository,      
    //Resolvers
    SalesmanagerMerchantContractResolver,
    //Guards
    SalesmanagerMerchantContractAuthGuard,
    //Interceptors
    SalesmanagerMerchantContractInterceptor,
    SalesmanagerMerchantContractLoggingInterceptor,
  ],
})
export class SalesmanagerMerchantContractModule {}

