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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { CommissionMode } from "../entities/commission-mode.entity";

//Definición de comandos
import {
  CreateCommissionModeCommand,
  UpdateCommissionModeCommand,
  DeleteCommissionModeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CommissionModeQueryService } from "../services/commissionmodequery.service";


import { CommissionModeResponse, CommissionModesResponse } from "../types/commissionmode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCommissionModeDto, 
CreateOrUpdateCommissionModeDto, 
CommissionModeValueInput, 
CommissionModeDto, 
CreateCommissionModeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CommissionMode)
export class CommissionModeResolver {

   //Constructor del resolver de CommissionMode
  constructor(
    private readonly service: CommissionModeQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  // Mutaciones
  @Mutation(() => CommissionModeResponse<CommissionMode>)
  async createCommissionMode(
    @Args("input", { type: () => CreateCommissionModeDto }) input: CreateCommissionModeDto
  ): Promise<CommissionModeResponse<CommissionMode>> {
    return this.commandBus.execute(new CreateCommissionModeCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Mutation(() => CommissionModeResponse<CommissionMode>)
  async updateCommissionMode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCommissionModeDto
  ): Promise<CommissionModeResponse<CommissionMode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCommissionModeCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Mutation(() => CommissionModeResponse<CommissionMode>)
  async createOrUpdateCommissionMode(
    @Args("data", { type: () => CreateOrUpdateCommissionModeDto })
    data: CreateOrUpdateCommissionModeDto
  ): Promise<CommissionModeResponse<CommissionMode>> {
    if (data.id) {
      const existingCommissionMode = await this.service.findById(data.id);
      if (existingCommissionMode) {
        return this.commandBus.execute(
          new UpdateCommissionModeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCommissionModeDto | UpdateCommissionModeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCommissionModeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCommissionModeDto | UpdateCommissionModeDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCommissionMode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCommissionModeCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  // Queries
  @Query(() => CommissionModesResponse<CommissionMode>)
  async commissionmodes(
    options?: FindManyOptions<CommissionMode>,
    paginationArgs?: PaginationArgs
  ): Promise<CommissionModesResponse<CommissionMode>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModesResponse<CommissionMode>)
  async commissionmode(
    @Args("id", { type: () => String }) id: string
  ): Promise<CommissionModeResponse<CommissionMode>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModesResponse<CommissionMode>)
  async commissionmodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CommissionModeValueInput }) value: CommissionModeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CommissionModesResponse<CommissionMode>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModesResponse<CommissionMode>)
  async commissionmodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CommissionModesResponse<CommissionMode>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => Number)
  async totalCommissionModes(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModesResponse<CommissionMode>)
  async searchCommissionModes(
    @Args("where", { type: () => CommissionModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CommissionModesResponse<CommissionMode>> {
    const commissionmodes = await this.service.findAndCount(where);
    return commissionmodes;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModeResponse<CommissionMode>, { nullable: true })
  async findOneCommissionMode(
    @Args("where", { type: () => CommissionModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CommissionModeResponse<CommissionMode>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CommissionModeResolver.name)

      .get(CommissionModeResolver.name),
    })
  @Query(() => CommissionModeResponse<CommissionMode>)
  async findOneCommissionModeOrFail(
    @Args("where", { type: () => CommissionModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CommissionModeResponse<CommissionMode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

