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
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { SalesmanagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { SalesmanagerMerchantContractResponse, SalesmanagerMerchantContractsResponse } from "../types/salesmanagermerchantcontract.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { SalesmanagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { SalesmanagerMerchantContractDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';

@ApiTags("SalesmanagerMerchantContract Query")
@Controller("salesmanagermerchantcontracts/query")
export class SalesmanagerMerchantContractQueryController {
  #logger = new Logger(SalesmanagerMerchantContractQueryController.name);

  constructor(private readonly service: SalesmanagerMerchantContractQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all salesmanagermerchantcontract with optional pagination" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractsResponse })
  @ApiQuery({ name: "options", required: false, type: SalesmanagerMerchantContractDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<SalesmanagerMerchantContract>    
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
     
      const salesmanagermerchantcontracts = await this.service.findAll(options);
      logger.info("Retrieving all salesmanagermerchantcontract");
      return salesmanagermerchantcontracts;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get salesmanagermerchantcontract by ID" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> })
  @ApiResponse({ status: 404, description: "SalesmanagerMerchantContract not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the salesmanagermerchantcontract to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    try {
      const salesmanagermerchantcontract = await this.service.findOne({ where: { id } });
      if (!salesmanagermerchantcontract) {
        throw new NotFoundException(
          "SalesmanagerMerchantContract no encontrado para el id solicitado"
        );
      }
      return salesmanagermerchantcontract;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find salesmanagermerchantcontract by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter salesmanagermerchantcontract', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractsResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
      const entities = await this.service.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      if (!entities) {
        throw new NotFoundException(
          "SalesmanagerMerchantContract no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find salesmanagermerchantcontracts with pagination" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract> })
  @ApiQuery({ name: "options", required: false, type: SalesmanagerMerchantContractDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<SalesmanagerMerchantContract>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades SalesmanagerMerchantContracts no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all salesmanagermerchantcontracts" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count salesmanagermerchantcontracts with conditions" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findAndCount(
    @Query() where: Record<string, any>={},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<SalesmanagerMerchantContractsResponse<SalesmanagerMerchantContract>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount({
        where: where,
        paginationArgs: paginationArgs,
      });

      if (!entities) {
        throw new NotFoundException(
          "Entidades SalesmanagerMerchantContracts no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one salesmanagermerchantcontract with conditions" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any>={}
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad SalesmanagerMerchantContract no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one salesmanagermerchantcontract or return error" })
  @ApiResponse({ status: 200, type: SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesmanagerMerchantContractQueryService.name)
      .get(SalesmanagerMerchantContractQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any>={}
  ): Promise<SalesmanagerMerchantContractResponse<SalesmanagerMerchantContract> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad SalesmanagerMerchantContract no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


