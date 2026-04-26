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
import { CommissionModeCommandController } from "../controllers/commissionmodecommand.controller";
import { CommissionModeQueryController } from "../controllers/commissionmodequery.controller";
import { CommissionModeCommandService } from "../services/commissionmodecommand.service";
import { CommissionModeQueryService } from "../services/commissionmodequery.service";

import { CommissionModeCommandRepository } from "../repositories/commissionmodecommand.repository";
import { CommissionModeQueryRepository } from "../repositories/commissionmodequery.repository";
import { CommissionModeRepository } from "../repositories/commissionmode.repository";
import { CommissionModeResolver } from "../graphql/commissionmode.resolver";
import { CommissionModeAuthGuard } from "../guards/commissionmodeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommissionMode } from "../entities/commission-mode.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCommissionModeHandler } from "../commands/handlers/createcommissionmode.handler";
import { UpdateCommissionModeHandler } from "../commands/handlers/updatecommissionmode.handler";
import { DeleteCommissionModeHandler } from "../commands/handlers/deletecommissionmode.handler";
import { GetCommissionModeByIdHandler } from "../queries/handlers/getcommissionmodebyid.handler";
import { GetCommissionModeByFieldHandler } from "../queries/handlers/getcommissionmodebyfield.handler";
import { GetAllCommissionModeHandler } from "../queries/handlers/getallcommissionmode.handler";
import { CommissionModeCrudSaga } from "../sagas/commissionmode-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CommissionModeInterceptor } from "../interceptors/commissionmode.interceptor";
import { CommissionModeLoggingInterceptor } from "../interceptors/commissionmode.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CommissionMode]), // Incluir BaseEntity para herencia
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
  controllers: [CommissionModeCommandController, CommissionModeQueryController],
  providers: [
    //Services
    EventStoreService,
    CommissionModeQueryService,
    CommissionModeCommandService,
  
    //Repositories
    CommissionModeCommandRepository,
    CommissionModeQueryRepository,
    CommissionModeRepository,      
    //Resolvers
    CommissionModeResolver,
    //Guards
    CommissionModeAuthGuard,
    //Interceptors
    CommissionModeInterceptor,
    CommissionModeLoggingInterceptor,
    //CQRS Handlers
    CreateCommissionModeHandler,
    UpdateCommissionModeHandler,
    DeleteCommissionModeHandler,
    GetCommissionModeByIdHandler,
    GetCommissionModeByFieldHandler,
    GetAllCommissionModeHandler,
    CommissionModeCrudSaga,
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
    CommissionModeQueryService,
    CommissionModeCommandService,
  
    //Repositories
    CommissionModeCommandRepository,
    CommissionModeQueryRepository,
    CommissionModeRepository,      
    //Resolvers
    CommissionModeResolver,
    //Guards
    CommissionModeAuthGuard,
    //Interceptors
    CommissionModeInterceptor,
    CommissionModeLoggingInterceptor,
  ],
})
export class CommissionModeModule {}

