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
import { SalesmanagerMerchantContractStatus } from "../entities/salesmanager-merchant-contract-status.entity";

//Definición de comandos
import {
  CreateSalesmanagerMerchantContractStatusCommand,
  UpdateSalesmanagerMerchantContractStatusCommand,
  DeleteSalesmanagerMerchantContractStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SalesmanagerMerchantContractStatusQueryService } from "../services/salesmanagermerchantcontractstatusquery.service";


import { SalesmanagerMerchantContractStatusResponse, SalesmanagerMerchantContractStatussResponse } from "../types/salesmanagermerchantcontractstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSalesmanagerMerchantContractStatusDto, 
CreateOrUpdateSalesmanagerMerchantContractStatusDto, 
SalesmanagerMerchantContractStatusValueInput, 
SalesmanagerMerchantContractStatusDto, 
CreateSalesmanagerMerchantContractStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => SalesmanagerMerchantContractStatus)
export class SalesmanagerMerchantContractStatusResolver {

   //Constructor del resolver de SalesmanagerMerchantContractStatus
  constructor(
    private readonly service: SalesmanagerMerchantContractStatusQueryService,
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>)
  async createSalesmanagerMerchantContractStatus(
    @Args("input", { type: () => CreateSalesmanagerMerchantContractStatusDto }) input: CreateSalesmanagerMerchantContractStatusDto
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    return this.commandBus.execute(new CreateSalesmanagerMerchantContractStatusCommand(input));
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Mutation(() => SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>)
  async updateSalesmanagerMerchantContractStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSalesmanagerMerchantContractStatusDto
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSalesmanagerMerchantContractStatusCommand(payLoad, {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Mutation(() => SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>)
  async createOrUpdateSalesmanagerMerchantContractStatus(
    @Args("data", { type: () => CreateOrUpdateSalesmanagerMerchantContractStatusDto })
    data: CreateOrUpdateSalesmanagerMerchantContractStatusDto
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    if (data.id) {
      const existingSalesmanagerMerchantContractStatus = await this.service.findById(data.id);
      if (existingSalesmanagerMerchantContractStatus) {
        return this.commandBus.execute(
          new UpdateSalesmanagerMerchantContractStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSalesmanagerMerchantContractStatusDto | UpdateSalesmanagerMerchantContractStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSalesmanagerMerchantContractStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSalesmanagerMerchantContractStatusDto | UpdateSalesmanagerMerchantContractStatusDto).createdBy ||
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSalesmanagerMerchantContractStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSalesmanagerMerchantContractStatusCommand(id));
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  // Queries
  @Query(() => SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>)
  async salesmanagermerchantcontractstatuss(
    options?: FindManyOptions<SalesmanagerMerchantContractStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>)
  async salesmanagermerchantcontractstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>)
  async salesmanagermerchantcontractstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SalesmanagerMerchantContractStatusValueInput }) value: SalesmanagerMerchantContractStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>)
  async salesmanagermerchantcontractstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => Number)
  async totalSalesmanagerMerchantContractStatuss(): Promise<number> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>)
  async searchSalesmanagerMerchantContractStatuss(
    @Args("where", { type: () => SalesmanagerMerchantContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
    const salesmanagermerchantcontractstatuss = await this.service.findAndCount(where);
    return salesmanagermerchantcontractstatuss;
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>, { nullable: true })
  async findOneSalesmanagerMerchantContractStatus(
    @Args("where", { type: () => SalesmanagerMerchantContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
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
      .registerClient(SalesmanagerMerchantContractStatusResolver.name)

      .get(SalesmanagerMerchantContractStatusResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>)
  async findOneSalesmanagerMerchantContractStatusOrFail(
    @Args("where", { type: () => SalesmanagerMerchantContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

