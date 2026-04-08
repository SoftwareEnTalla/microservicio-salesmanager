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
import { Salesmanager } from "../entities/salesmanager.entity";

//Definición de comandos
import {
  CreateSalesmanagerCommand,
  UpdateSalesmanagerCommand,
  DeleteSalesmanagerCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SalesmanagerQueryService } from "../services/salesmanagerquery.service";


import { SalesmanagerResponse, SalesmanagersResponse } from "../types/salesmanager.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSalesmanagerDto, 
CreateOrUpdateSalesmanagerDto, 
SalesmanagerValueInput, 
SalesmanagerDto, 
CreateSalesmanagerDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Salesmanager)
export class SalesmanagerResolver {

   //Constructor del resolver de Salesmanager
  constructor(
    private readonly service: SalesmanagerQueryService,
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  // Mutaciones
  @Mutation(() => SalesmanagerResponse<Salesmanager>)
  async createSalesmanager(
    @Args("input", { type: () => CreateSalesmanagerDto }) input: CreateSalesmanagerDto
  ): Promise<SalesmanagerResponse<Salesmanager>> {
    return this.commandBus.execute(new CreateSalesmanagerCommand(input));
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Mutation(() => SalesmanagerResponse<Salesmanager>)
  async updateSalesmanager(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSalesmanagerDto
  ): Promise<SalesmanagerResponse<Salesmanager>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSalesmanagerCommand(payLoad, {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Mutation(() => SalesmanagerResponse<Salesmanager>)
  async createOrUpdateSalesmanager(
    @Args("data", { type: () => CreateOrUpdateSalesmanagerDto })
    data: CreateOrUpdateSalesmanagerDto
  ): Promise<SalesmanagerResponse<Salesmanager>> {
    if (data.id) {
      const existingSalesmanager = await this.service.findById(data.id);
      if (existingSalesmanager) {
        return this.commandBus.execute(
          new UpdateSalesmanagerCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSalesmanagerDto | UpdateSalesmanagerDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSalesmanagerCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSalesmanagerDto | UpdateSalesmanagerDto).createdBy ||
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSalesmanager(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSalesmanagerCommand(id));
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  // Queries
  @Query(() => SalesmanagersResponse<Salesmanager>)
  async salesmanagers(
    options?: FindManyOptions<Salesmanager>,
    paginationArgs?: PaginationArgs
  ): Promise<SalesmanagersResponse<Salesmanager>> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagersResponse<Salesmanager>)
  async salesmanager(
    @Args("id", { type: () => String }) id: string
  ): Promise<SalesmanagerResponse<Salesmanager>> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagersResponse<Salesmanager>)
  async salesmanagersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SalesmanagerValueInput }) value: SalesmanagerValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagersResponse<Salesmanager>> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagersResponse<Salesmanager>)
  async salesmanagersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagersResponse<Salesmanager>> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => Number)
  async totalSalesmanagers(): Promise<number> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagersResponse<Salesmanager>)
  async searchSalesmanagers(
    @Args("where", { type: () => SalesmanagerDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagersResponse<Salesmanager>> {
    const salesmanagers = await this.service.findAndCount(where);
    return salesmanagers;
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagerResponse<Salesmanager>, { nullable: true })
  async findOneSalesmanager(
    @Args("where", { type: () => SalesmanagerDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerResponse<Salesmanager>> {
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
      .registerClient(SalesmanagerResolver.name)

      .get(SalesmanagerResolver.name),
    })
  @Query(() => SalesmanagerResponse<Salesmanager>)
  async findOneSalesmanagerOrFail(
    @Args("where", { type: () => SalesmanagerDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerResponse<Salesmanager> | Error> {
    return this.service.findOneOrFail(where);
  }
}

