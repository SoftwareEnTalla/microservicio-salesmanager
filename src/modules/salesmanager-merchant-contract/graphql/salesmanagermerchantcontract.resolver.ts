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
import { SalesmanagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";

//Definición de comandos
import {
  CreateSalesmanagerMerchantContractCommand,
  UpdateSalesmanagerMerchantContractCommand,
  DeleteSalesmanagerMerchantContractCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SalesmanagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";


import { SalesmanagerMerchantContractResponse, SalesmanagerMerchantContractsResponse } from "../types/salesmanagermerchantcontract.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSalesmanagerMerchantContractDto, 
CreateOrUpdateSalesmanagerMerchantContractDto, 
SalesmanagerMerchantContractValueInput, 
SalesmanagerMerchantContractDto, 
CreateSalesmanagerMerchantContractDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => SalesmanagerMerchantContract)
export class SalesmanagerMerchantContractResolver {

   //Constructor del resolver de SalesmanagerMerchantContract
  constructor(
    private readonly service: SalesmanagerMerchantContractQueryService,
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  // Mutaciones
  @Mutation(() => SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>)
  async createSalesmanagerMerchantContract(
    @Args("input", { type: () => CreateSalesmanagerMerchantContractDto }) input: CreateSalesmanagerMerchantContractDto
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    return this.commandBus.execute(new CreateSalesmanagerMerchantContractCommand(input));
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Mutation(() => SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>)
  async updateSalesmanagerMerchantContract(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSalesmanagerMerchantContractDto
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSalesmanagerMerchantContractCommand(payLoad, {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Mutation(() => SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>)
  async createOrUpdateSalesmanagerMerchantContract(
    @Args("data", { type: () => CreateOrUpdateSalesmanagerMerchantContractDto })
    data: CreateOrUpdateSalesmanagerMerchantContractDto
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    if (data.id) {
      const existingSalesmanagerMerchantContract = await this.service.findById(data.id);
      if (existingSalesmanagerMerchantContract) {
        return this.commandBus.execute(
          new UpdateSalesmanagerMerchantContractCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSalesmanagerMerchantContractDto | UpdateSalesmanagerMerchantContractDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSalesmanagerMerchantContractCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSalesmanagerMerchantContractDto | UpdateSalesmanagerMerchantContractDto).createdBy ||
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSalesmanagerMerchantContract(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSalesmanagerMerchantContractCommand(id));
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  // Queries
  @Query(() => SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>)
  async salesmanagermerchantcontracts(
    options?: FindManyOptions<SalesmanagerMerchantContract>,
    paginationArgs?: PaginationArgs
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>)
  async salesmanagermerchantcontract(
    @Args("id", { type: () => String }) id: string
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>)
  async salesmanagermerchantcontractsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SalesmanagerMerchantContractValueInput }) value: SalesmanagerMerchantContractValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>)
  async salesmanagermerchantcontractsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => Number)
  async totalSalesmanagerMerchantContracts(): Promise<number> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>)
  async searchSalesmanagerMerchantContracts(
    @Args("where", { type: () => SalesmanagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    const salesmanagermerchantcontracts = await this.service.findAndCount(where);
    return salesmanagermerchantcontracts;
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>, { nullable: true })
  async findOneSalesmanagerMerchantContract(
    @Args("where", { type: () => SalesmanagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
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
      .registerClient(SalesmanagerMerchantContractResolver.name)

      .get(SalesmanagerMerchantContractResolver.name),
    })
  @Query(() => SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>)
  async findOneSalesmanagerMerchantContractOrFail(
    @Args("where", { type: () => SalesmanagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> | Error> {
    return this.service.findOneOrFail(where);
  }
}

