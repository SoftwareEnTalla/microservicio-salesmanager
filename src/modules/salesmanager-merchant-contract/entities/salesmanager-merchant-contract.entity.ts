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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateSalesManagerMerchantContractDto, UpdateSalesManagerMerchantContractDto, DeleteSalesManagerMerchantContractDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { SalesManager } from '../../salesmanager/entities/salesmanager.entity';

@Index('idx_salesmanager_contract_code', ['contractCode'], { unique: true })
@Index('idx_salesmanager_contract_salesmanager_status', ['salesManagerId', 'status'])
@Unique('uq_salesmanager_contract_code', ['contractCode'])
@ChildEntity('salesmanagermerchantcontract')
@ObjectType()
export class SalesManagerMerchantContract extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de SalesManagerMerchantContract",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de SalesManagerMerchantContract", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia SalesManagerMerchantContract' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de SalesManagerMerchantContract",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de SalesManagerMerchantContract", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia SalesManagerMerchantContract' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Gestor de ventas asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Gestor de ventas asociado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Gestor de ventas asociado' })
  salesManagerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia externa al merchant contratado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia externa al merchant contratado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Referencia externa al merchant contratado' })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del contrato', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 100, unique: true, comment: 'Código del contrato' })
  contractCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contrato', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'DRAFT', comment: 'Estado del contrato' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de comisión pactado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de comisión pactado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PERCENTAGE', comment: 'Modo de comisión pactado' })
  commissionMode!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor principal de la comisión',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor principal de la comisión', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Valor principal de la comisión' })
  commissionValue?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de inicio del contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de inicio del contrato', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de inicio del contrato' })
  startsAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de finalización del contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de finalización del contrato', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de finalización del contrato' })
  endsAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si habilita comisión por referidos',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si habilita comisión por referidos', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si habilita comisión por referidos' })
  allowsReferralCommissions!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Resumen de términos y condiciones',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Resumen de términos y condiciones', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Resumen de términos y condiciones' })
  termsSummary?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del contrato',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del contrato', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del contrato' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => SalesManager,
    nullable: false,
    description: 'Relación con SalesManager',
  })
  @Field(() => SalesManager, { nullable: false })
  @ManyToOne(() => SalesManager, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesManagerId' })
  salesManager!: SalesManager;

  // Referencia externa a Merchant del bounded context merchant; se integra vía event-driven sin dependencia ORM directa.

  protected executeDslLifecycle(): void {
    // Rule: active-contract-must-have-start-date
    // Todo contrato activo debe registrar fecha de inicio.
    if (!(this.status !== 'ACTIVE' && !(this.startsAt === undefined || this.startsAt === null || (typeof this.startsAt === 'string' && String(this.startsAt).trim() === '') || (Array.isArray(this.startsAt) && this.startsAt.length === 0) || (typeof this.startsAt === 'object' && !Array.isArray(this.startsAt) && Object.prototype.toString.call(this.startsAt) === '[object Object]' && Object.keys(Object(this.startsAt)).length === 0)))) {
      throw new Error('SALESMANAGER_CONTRACT_001: El contrato activo debe tener fecha de inicio');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'salesmanagermerchantcontract';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateSalesManagerMerchantContractDto): SalesManagerMerchantContract;
  static fromDto(dto: UpdateSalesManagerMerchantContractDto): SalesManagerMerchantContract;
  static fromDto(dto: DeleteSalesManagerMerchantContractDto): SalesManagerMerchantContract;
  static fromDto(dto: any): SalesManagerMerchantContract {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(SalesManagerMerchantContract, dto);
  }
}
