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
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { SalesmanagerMerchantContractStatusCommandService } from "../services/salesmanagermerchantcontractstatuscommand.service";
import { SalesmanagerMerchantContractStatusAuthGuard } from "../guards/salesmanagermerchantcontractstatusauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { SalesmanagerMerchantContractStatus } from "../entities/salesmanager-merchant-contract-status.entity";
import { SalesmanagerMerchantContractStatusResponse, SalesmanagerMerchantContractStatussResponse } from "../types/salesmanagermerchantcontractstatus.types";
import { CreateSalesmanagerMerchantContractStatusDto, UpdateSalesmanagerMerchantContractStatusDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { SalesmanagerMerchantContractStatusCreatedEvent } from "../events/salesmanagermerchantcontractstatuscreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("SalesmanagerMerchantContractStatus Command")
@UseGuards(SalesmanagerMerchantContractStatusAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("salesmanagermerchantcontractstatuss/command")
export class SalesmanagerMerchantContractStatusCommandController {

  #logger = new Logger(SalesmanagerMerchantContractStatusCommandController.name);

  //Constructor del controlador: SalesmanagerMerchantContractStatusCommandController
  constructor(
  private readonly service: SalesmanagerMerchantContractStatusCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new salesmanagermerchantcontractstatus" })
  @ApiBody({ type: CreateSalesmanagerMerchantContractStatusDto })
  @ApiResponse({ status: 201, type: SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus> })
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async create(
    @Body() createSalesmanagerMerchantContractStatusDtoInput: CreateSalesmanagerMerchantContractStatusDto
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    try {
      logger.info("Receiving in controller:", createSalesmanagerMerchantContractStatusDtoInput);
      const entity = await this.service.create(createSalesmanagerMerchantContractStatusDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response salesmanagermerchantcontractstatus entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("SalesmanagerMerchantContractStatus entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id salesmanagermerchantcontractstatus is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple salesmanagermerchantcontractstatuss" })
  @ApiBody({ type: [CreateSalesmanagerMerchantContractStatusDto] })
  @ApiResponse({ status: 201, type: SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus> })
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async bulkCreate(
    @Body() createSalesmanagerMerchantContractStatusDtosInput: CreateSalesmanagerMerchantContractStatusDto[]
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
    try {
      const entities = await this.service.bulkCreate(createSalesmanagerMerchantContractStatusDtosInput);

      if (!entities) {
        throw new NotFoundException("SalesmanagerMerchantContractStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an salesmanagermerchantcontractstatus" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateSalesmanagerMerchantContractStatusDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia SalesmanagerMerchantContractStatus a actualizar.",
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs (auto-asigna id de la URL si el body no lo trae)
      if (partialEntity?.id && id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de SalesmanagerMerchantContractStatus a actualizar."
        );
      }
      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de SalesmanagerMerchantContractStatus no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple salesmanagermerchantcontractstatuss" })
  @ApiBody({ type: [UpdateSalesmanagerMerchantContractStatusDto] })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus> })
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateSalesmanagerMerchantContractStatusDto[]
  ): Promise<SalesmanagerMerchantContractStatussResponse<SalesmanagerMerchantContractStatus>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("SalesmanagerMerchantContractStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an salesmanagermerchantcontractstatus" })   
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>,description:
    "Instancia de SalesmanagerMerchantContractStatus eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia SalesmanagerMerchantContractStatus a eliminar.",
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<SalesmanagerMerchantContractStatusResponse<SalesmanagerMerchantContractStatus>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("SalesmanagerMerchantContractStatus entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple salesmanagermerchantcontractstatuss" })
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
      .registerClient(SalesmanagerMerchantContractStatusCommandController.name)
      .get(SalesmanagerMerchantContractStatusCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

