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
import { SalesManagerMerchantContractQueryService } from "../services/salesmanagermerchantcontractquery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { SalesManagerMerchantContractResponse, SalesManagerMerchantContractsResponse } from "../types/salesmanagermerchantcontract.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { SalesManagerMerchantContract } from "../entities/salesmanager-merchant-contract.entity";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { SalesManagerMerchantContractDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';


/**
 * Parseo tolerante del query param 'where':
 *  - Si llega como ?where={JSON}, lo parsea a objeto.
 *  - Si llega como query params planos (?isActive=true) descarta claves
 *    reservadas de paginación y devuelve el resto como where plano.
 *  - Nunca devuelve un objeto envuelto en { where: ... } (evita double-wrap).
 */
function parseWhereParam(all: Record<string, any> = {}): Record<string, any> {
  if (!all || typeof all !== "object") return {};
  const raw = (all as any).where;
  if (typeof raw === "string" && raw.trim().startsWith("{")) {
    try { return JSON.parse(raw); } catch { /* fallthrough */ }
  }
  if (raw && typeof raw === "object") return raw as Record<string, any>;
  const reserved = new Set(["where","page","size","sort","order","search","initDate","endDate","options"]);
  const rest: Record<string, any> = {};
  for (const k of Object.keys(all)) if (!reserved.has(k)) rest[k] = (all as any)[k];
  return rest;
}

@ApiTags("SalesManagerMerchantContract Query")
@Controller("salesmanagermerchantcontracts/query")
export class SalesManagerMerchantContractQueryController {
  #logger = new Logger(SalesManagerMerchantContractQueryController.name);

  constructor(private readonly service: SalesManagerMerchantContractQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all salesmanagermerchantcontract with optional pagination" })
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractsResponse })
  @ApiQuery({ name: "options", required: false, type: SalesManagerMerchantContractDto }) // Ajustar según el tipo real
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
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<SalesManagerMerchantContract>    
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
    try {
     
      const salesmanagermerchantcontracts = await this.service.findAll(options);
      logger.info("Retrieving all salesmanagermerchantcontract");
      return salesmanagermerchantcontracts;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find salesmanagermerchantcontract by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter salesmanagermerchantcontract', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractsResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
    try {
      const entities = await this.service.findAndCount(
        { [field]: value },
        paginationArgs
      );

      if (!entities) {
        throw new NotFoundException(
          "SalesManagerMerchantContract no encontrados para la propiedad y valor especificado"
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
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractsResponse<SalesManagerMerchantContract> })
  @ApiQuery({ name: "options", required: false, type: SalesManagerMerchantContractDto }) // Ajustar según el tipo real
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
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<SalesManagerMerchantContract>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
        throw new NotFoundException("Entidades SalesManagerMerchantContracts no encontradas.");
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
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count salesmanagermerchantcontracts with conditions" })
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractsResponse<SalesManagerMerchantContract> })
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
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findAndCount(
    @Query() all: Record<string, any> = {},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<SalesManagerMerchantContractsResponse<SalesManagerMerchantContract>> {
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
      const entities = await this.service.findAndCount(
        parseWhereParam(all),
        paginationArgs
      );

      if (!entities) {
        throw new NotFoundException(
          "Entidades SalesManagerMerchantContracts no encontradas para el criterio especificado."
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
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractResponse<SalesManagerMerchantContract> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findOne(
    @Query() all: Record<string, any> = {}
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        throw new NotFoundException("Entidad SalesManagerMerchantContract no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one salesmanagermerchantcontract or return error" })
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractResponse<SalesManagerMerchantContract> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findOneOrFail(
    @Query() all: Record<string, any> = {}
  ): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract> | Error> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        return new NotFoundException("Entidad SalesManagerMerchantContract no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
  @Get(":id")
  @ApiOperation({ summary: "Get salesmanagermerchantcontract by ID" })
  @ApiResponse({ status: 200, type: SalesManagerMerchantContractResponse<SalesManagerMerchantContract> })
  @ApiResponse({ status: 404, description: "SalesManagerMerchantContract not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the salesmanagermerchantcontract to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(SalesManagerMerchantContractQueryService.name)
      .get(SalesManagerMerchantContractQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<SalesManagerMerchantContractResponse<SalesManagerMerchantContract>> {
    try {
      const salesmanagermerchantcontract = await this.service.findOne({ where: { id } });
      if (!salesmanagermerchantcontract) {
        throw new NotFoundException(
          "SalesManagerMerchantContract no encontrado para el id solicitado"
        );
      }
      return salesmanagermerchantcontract;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

}


