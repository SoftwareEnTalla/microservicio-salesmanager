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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { SalesmanagerMerchantContractStatusDto } from '../dtos/all-dto';
import { SalesmanagerMerchantContractStatusGraphqlService } from '../services/salesmanagermerchantcontractstatus.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => SalesmanagerMerchantContractStatusDto)
export class SalesmanagerMerchantContractStatusGraphqlQuery {
  constructor(private readonly service: SalesmanagerMerchantContractStatusGraphqlService) {}

  @Query(() => [SalesmanagerMerchantContractStatusDto], { name: 'findAllSalesmanagerMerchantContractStatuss' })
  async findAll(): Promise<SalesmanagerMerchantContractStatusDto[]> {
    return this.service.findAll();
  }

  @Query(() => SalesmanagerMerchantContractStatusDto, { name: 'findSalesmanagerMerchantContractStatusById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<SalesmanagerMerchantContractStatusDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("SalesmanagerMerchantContractStatus con id " + id + " no encontrado");
    }
    return result;
  }
}
