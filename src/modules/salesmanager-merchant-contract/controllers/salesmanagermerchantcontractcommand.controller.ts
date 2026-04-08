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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { SalesmanagerMerchantContractCommandService } from "../services/salesmanagermerchantcontractcommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { SalesmanagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";
import { SalesmanagerMerchantContractResponse, SalesmanagerMerchantContractsResponse } from "../types/salesmanagermerchantcontract.types";
import { CreateSalesmanagerMerchantContractDto, UpdateSalesmanagerMerchantContractDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { SalesmanagerMerchantContractCreatedEvent } from "../events/salesmanagermerchantcontractcreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("SalesmanagerMerchantContract Command")
@Controller("salesmanagermerchantcontracts/command")
export class SalesmanagerMerchantContractCommandController {

  #logger = new Logger(SalesmanagerMerchantContractCommandController.name);

  //Constructor del controlador: SalesmanagerMerchantContractCommandController
  constructor(
  private readonly service: SalesmanagerMerchantContractCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new salesmanagermerchantcontract" })
  @ApiBody({ type: CreateSalesmanagerMerchantContractDto })
  @ApiResponse({ status: 201, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async create(
    @Body() createSalesmanagerMerchantContractDtoInput: CreateSalesmanagerMerchantContractDto
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    try {
      logger.info("Receiving in controller:", createSalesmanagerMerchantContractDtoInput);
      const entity = await this.service.create(createSalesmanagerMerchantContractDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response salesmanagermerchantcontract entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("SalesmanagerMerchantContract entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id salesmanagermerchantcontract is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple salesmanagermerchantcontracts" })
  @ApiBody({ type: [CreateSalesmanagerMerchantContractDto] })
  @ApiResponse({ status: 201, type: SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async bulkCreate(
    @Body() createSalesmanagerMerchantContractDtosInput: CreateSalesmanagerMerchantContractDto[]
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
      const entities = await this.service.bulkCreate(createSalesmanagerMerchantContractDtosInput);

      if (!entities) {
        throw new NotFoundException("SalesmanagerMerchantContract entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an salesmanagermerchantcontract" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateSalesmanagerMerchantContractDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia SalesmanagerMerchantContract a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de SalesmanagerMerchantContract a actualizar."
        );
      }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de SalesmanagerMerchantContract no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple salesmanagermerchantcontracts" })
  @ApiBody({ type: [UpdateSalesmanagerMerchantContractDto] })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateSalesmanagerMerchantContractDto[]
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("SalesmanagerMerchantContract entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an salesmanagermerchantcontract" })   
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>,description:
    "Instancia de SalesmanagerMerchantContract eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia SalesmanagerMerchantContract a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("SalesmanagerMerchantContract entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple salesmanagermerchantcontracts" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(SalesmanagerMerchantContractCommandController.name)
      .get(SalesmanagerMerchantContractCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

