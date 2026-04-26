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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { SalesmanagerMerchantContractStatus } from '../entities/salesmanager-merchant-contract-status.entity';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {SalesmanagerMerchantContractStatusRepository} from './salesmanagermerchantcontractstatus.repository'

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

  @Injectable()
  export class SalesmanagerMerchantContractStatusQueryRepository {

    //Constructor del repositorio de datos: SalesmanagerMerchantContractStatusQueryRepository
    constructor(
      @InjectRepository(SalesmanagerMerchantContractStatus)
      private readonly repository: Repository<SalesmanagerMerchantContractStatus>
    ) {
      this.validate();
    }

    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    private validate(): void {
      const entityInstance = Object.create(SalesmanagerMerchantContractStatus.prototype);

      if (!(entityInstance instanceof BaseEntity)) {
        throw new Error(
          `El tipo ${SalesmanagerMerchantContractStatus.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
        );
      }
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findAll(options?: FindManyOptions<SalesmanagerMerchantContractStatus>): Promise<SalesmanagerMerchantContractStatus[]> {
      logger.info('Ready to findAll SalesmanagerMerchantContractStatus on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findById(id: string): Promise<SalesmanagerMerchantContractStatus | null> {
      const tmp: FindOptionsWhere<SalesmanagerMerchantContractStatus> = { id } as FindOptionsWhere<SalesmanagerMerchantContractStatus>;
      logger.info('Ready to findById SalesmanagerMerchantContractStatus on repository:', tmp);
      return this.repository.findOneBy(tmp);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findByField(
      field: string,
      value: any,
      page: number,
      limit: number
    ): Promise<SalesmanagerMerchantContractStatus[]> {
      let options={
        where: { [field]: value },
        skip: (page - 1) * limit,
        take: limit,
      };
      logger.info('Ready to findByField SalesmanagerMerchantContractStatus on repository:', options);
      const [entities] = await this.repository.findAndCount(options);
      return entities;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findWithPagination(
      options: FindManyOptions<SalesmanagerMerchantContractStatus>,
      page: number,
      limit: number
    ): Promise<SalesmanagerMerchantContractStatus[]> {
      const skip = (page - 1) * limit;
      options={ ...options, skip, take: limit };
      logger.info('Ready to findWithPagination SalesmanagerMerchantContractStatus on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async count(): Promise<number> {
      logger.info('Ready to count SalesmanagerMerchantContractStatus on repository...');
      let result= this.repository.count();
      logger.info('Was counted  instances of SalesmanagerMerchantContractStatus on repository:');
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findAndCount(where?: Record<string, any>): Promise<[SalesmanagerMerchantContractStatus[], number]> {
      logger.info('Ready to findAndCount SalesmanagerMerchantContractStatus on repository:',where);
      let result= this.repository.findAndCount({
        where: where,
      });
      logger.info('Was counted  instances of SalesmanagerMerchantContractStatus on repository:',result);
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findOne(options?: Record<string, any>): Promise<SalesmanagerMerchantContractStatus | null> {
      if (!options || Object.keys(options).length === 0) {
        logger.warn('No conditions provided for finding SalesmanagerMerchantContractStatus.');
        return null;
      }
      // Soporta tanto 'where plano' como FindOneOptions ({ where, relations, order, select })
      const isFindOneOptions = 'where' in options || 'relations' in options || 'order' in options || 'select' in options;
      if (isFindOneOptions) {
        logger.info('Ready to findOne (FindOneOptions) SalesmanagerMerchantContractStatus:', options);
        return this.repository.findOne(options as any);
      }
      const tmp: FindOptionsWhere<SalesmanagerMerchantContractStatus> = options as FindOptionsWhere<SalesmanagerMerchantContractStatus>;
      logger.info('Ready to findOneBy SalesmanagerMerchantContractStatus on repository:', tmp);
      return this.repository.findOneBy(tmp);
    }


@LogExecutionTime({
    layer: 'repository',
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
      .registerClient(SalesmanagerMerchantContractStatusRepository.name)
      .get(SalesmanagerMerchantContractStatusRepository.name),
  })
    async findOneOrFail(where?: Record<string, any>): Promise<SalesmanagerMerchantContractStatus> {
      logger.info('Ready to findOneOrFail SalesmanagerMerchantContractStatus on repository:',where);
      const entity = await this.repository.findOne({
        where: where,
      });
      if (!entity) {
        throw new Error('Entity not found');
      }
      return entity;
    }
}
