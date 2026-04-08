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
import { SalesmanagerCommandController } from "../controllers/salesmanagercommand.controller";
import { SalesmanagerQueryController } from "../controllers/salesmanagerquery.controller";
import { SalesmanagerCommandService } from "../services/salesmanagercommand.service";
import { SalesmanagerQueryService } from "../services/salesmanagerquery.service";
import { SalesmanagerCommandRepository } from "../repositories/salesmanagercommand.repository";
import { SalesmanagerQueryRepository } from "../repositories/salesmanagerquery.repository";
import { SalesmanagerRepository } from "../repositories/salesmanager.repository";
import { SalesmanagerResolver } from "../graphql/salesmanager.resolver";
import { SalesmanagerAuthGuard } from "../guards/salesmanagerauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Salesmanager } from "../entities/salesmanager.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSalesmanagerHandler } from "../commands/handlers/createsalesmanager.handler";
import { UpdateSalesmanagerHandler } from "../commands/handlers/updatesalesmanager.handler";
import { DeleteSalesmanagerHandler } from "../commands/handlers/deletesalesmanager.handler";
import { GetSalesmanagerByIdHandler } from "../queries/handlers/getsalesmanagerbyid.handler";
import { GetSalesmanagerByFieldHandler } from "../queries/handlers/getsalesmanagerbyfield.handler";
import { GetAllSalesmanagerHandler } from "../queries/handlers/getallsalesmanager.handler";
import { SalesmanagerCrudSaga } from "../sagas/salesmanager-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SalesmanagerInterceptor } from "../interceptors/salesmanager.interceptor";
import { SalesmanagerLoggingInterceptor } from "../interceptors/salesmanager.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Salesmanager]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [SalesmanagerCommandController, SalesmanagerQueryController],
  providers: [
    //Services
    EventStoreService,
    SalesmanagerQueryService,
    SalesmanagerCommandService,
    //Repositories
    SalesmanagerCommandRepository,
    SalesmanagerQueryRepository,
    SalesmanagerRepository,      
    //Resolvers
    SalesmanagerResolver,
    //Guards
    SalesmanagerAuthGuard,
    //Interceptors
    SalesmanagerInterceptor,
    SalesmanagerLoggingInterceptor,
    //CQRS Handlers
    CreateSalesmanagerHandler,
    UpdateSalesmanagerHandler,
    DeleteSalesmanagerHandler,
    GetSalesmanagerByIdHandler,
    GetSalesmanagerByFieldHandler,
    GetAllSalesmanagerHandler,
    SalesmanagerCrudSaga,
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
    SalesmanagerQueryService,
    SalesmanagerCommandService,
    //Repositories
    SalesmanagerCommandRepository,
    SalesmanagerQueryRepository,
    SalesmanagerRepository,      
    //Resolvers
    SalesmanagerResolver,
    //Guards
    SalesmanagerAuthGuard,
    //Interceptors
    SalesmanagerInterceptor,
    SalesmanagerLoggingInterceptor,
  ],
})
export class SalesmanagerModule {}

