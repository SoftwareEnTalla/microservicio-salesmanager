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
import { SalesManagerMerchantContract } from "../entities/sales-manager-merchant-contract.entity";

//Definición de comandos
import {
  CreateSalesManagerMerchantContractCommand,
  UpdateSalesManagerMerchantContractCommand,
  DeleteSalesManagerMerchantContractCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SalesManagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";


import { SalesManagerMerchantContractResponse, SalesManagerMerchantContractsResponse } from "../types/salesmanagermerchantcontract.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSalesManagerMerchantContractDto, 
CreateOrUpdateSalesManagerMerchantContractDto, 
SalesManagerMerchantContractValueInput, 
SalesManagerMerchantContractDto, 
CreateSalesManagerMerchantContractDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => SalesManagerMerchantContract)
export class SalesManagerMerchantContractResolver {

   //Constructor del resolver de SalesManagerMerchantContract
  constructor(
    private readonly service: SalesManagerMerchantContractQueryService,
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  // Mutaciones
  @Mutation(() => SalesManagerMerchantContractResponse<SalesManagerMerchantContract>)
  async createSalesManagerMerchantContract(
    @Args("input", { type: () => CreateSalesManagerMerchantContractDto }) input: CreateSalesManagerMerchantContractDto
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
    return this.commandBus.execute(new CreateSalesManagerMerchantContractCommand(input));
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Mutation(() => SalesManagerMerchantContractResponse<SalesManagerMerchantContract>)
  async updateSalesManagerMerchantContract(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSalesManagerMerchantContractDto
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSalesManagerMerchantContractCommand(payLoad, {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Mutation(() => SalesManagerMerchantContractResponse<SalesManagerMerchantContract>)
  async createOrUpdateSalesManagerMerchantContract(
    @Args("data", { type: () => CreateOrUpdateSalesManagerMerchantContractDto })
    data: CreateOrUpdateSalesManagerMerchantContractDto
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
    if (data.id) {
      const existingSalesManagerMerchantContract = await this.service.findById(data.id);
      if (existingSalesManagerMerchantContract) {
        return this.commandBus.execute(
          new UpdateSalesManagerMerchantContractCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSalesManagerMerchantContractDto | UpdateSalesManagerMerchantContractDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSalesManagerMerchantContractCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSalesManagerMerchantContractDto | UpdateSalesManagerMerchantContractDto).createdBy ||
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSalesManagerMerchantContract(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSalesManagerMerchantContractCommand(id));
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  // Queries
  @Query(() => SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>)
  async salesmanagermerchantcontracts(
    options?: FindManyOptions<SalesManagerMerchantContract>,
    paginationArgs?: PaginationArgs
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>)
  async salesmanagermerchantcontract(
    @Args("id", { type: () => String }) id: string
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>)
  async salesmanagermerchantcontractsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SalesManagerMerchantContractValueInput }) value: SalesManagerMerchantContractValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>)
  async salesmanagermerchantcontractsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => Number)
  async totalSalesManagerMerchantContracts(): Promise<number> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>)
  async searchSalesManagerMerchantContracts(
    @Args("where", { type: () => SalesManagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractResponse<SalesManagerMerchantContract>, { nullable: true })
  async findOneSalesManagerMerchantContract(
    @Args("where", { type: () => SalesManagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
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
      .registerClient(SalesManagerMerchantContractResolver.name)

      .get(SalesManagerMerchantContractResolver.name),
    })
  @Query(() => SalesManagerMerchantContractResponse<SalesManagerMerchantContract>)
  async findOneSalesManagerMerchantContractOrFail(
    @Args("where", { type: () => SalesManagerMerchantContractDto, nullable: false })
    where: Record<string, any>
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract> | Error> {
    return this.service.findOneOrFail(where);
  }
}

