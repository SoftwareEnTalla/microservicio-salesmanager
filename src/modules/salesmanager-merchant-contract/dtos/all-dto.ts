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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseSalesManagerMerchantContractDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateSalesManagerMerchantContract',
    example: 'Nombre de instancia CreateSalesManagerMerchantContract',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateSalesManagerMerchantContractDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateSalesManagerMerchantContract).',
    example: 'Fecha de creación de la instancia (CreateSalesManagerMerchantContract).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateSalesManagerMerchantContract).',
    example: 'Fecha de actualización de la instancia (CreateSalesManagerMerchantContract).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateSalesManagerMerchantContract).',
    example:
      'Usuario que realiza la creación de la instancia (CreateSalesManagerMerchantContract).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateSalesManagerMerchantContract).',
    example: 'Estado de activación de la instancia (CreateSalesManagerMerchantContract).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Gestor de ventas asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Gestor de ventas asociado', nullable: false })
  salesManagerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia externa al merchant contratado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia externa al merchant contratado', nullable: false })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del contrato', nullable: false })
  contractCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contrato', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de comisión pactado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de comisión pactado', nullable: false })
  commissionMode!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor principal de la comisión',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor principal de la comisión', nullable: true })
  commissionValue?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de inicio del contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de inicio del contrato', nullable: true })
  startsAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de finalización del contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de finalización del contrato', nullable: true })
  endsAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si habilita comisión por referidos',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si habilita comisión por referidos', nullable: false })
  allowsReferralCommissions!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Resumen de términos y condiciones',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Resumen de términos y condiciones', nullable: true })
  termsSummary?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del contrato',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del contrato', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseSalesManagerMerchantContractDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class SalesManagerMerchantContractDto extends BaseSalesManagerMerchantContractDto {
  // Propiedades específicas de la clase SalesManagerMerchantContractDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<SalesManagerMerchantContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<SalesManagerMerchantContractDto>): SalesManagerMerchantContractDto {
    const instance = new SalesManagerMerchantContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class SalesManagerMerchantContractValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => SalesManagerMerchantContractDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => SalesManagerMerchantContractDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class SalesManagerMerchantContractOutPutDto extends BaseSalesManagerMerchantContractDto {
  // Propiedades específicas de la clase SalesManagerMerchantContractOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<SalesManagerMerchantContractOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<SalesManagerMerchantContractOutPutDto>): SalesManagerMerchantContractOutPutDto {
    const instance = new SalesManagerMerchantContractOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateSalesManagerMerchantContractDto extends BaseSalesManagerMerchantContractDto {
  // Propiedades específicas de la clase CreateSalesManagerMerchantContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateSalesManagerMerchantContract a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateSalesManagerMerchantContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateSalesManagerMerchantContractDto>): CreateSalesManagerMerchantContractDto {
    const instance = new CreateSalesManagerMerchantContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateSalesManagerMerchantContractDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateSalesManagerMerchantContractDto,
    description: 'Instancia CreateSalesManagerMerchantContract o UpdateSalesManagerMerchantContract',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateSalesManagerMerchantContractDto, { nullable: true })
  input?: CreateSalesManagerMerchantContractDto | UpdateSalesManagerMerchantContractDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteSalesManagerMerchantContractDto {
  // Propiedades específicas de la clase DeleteSalesManagerMerchantContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteSalesManagerMerchantContract a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteSalesManagerMerchantContract a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateSalesManagerMerchantContractDto extends BaseSalesManagerMerchantContractDto {
  // Propiedades específicas de la clase UpdateSalesManagerMerchantContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateSalesManagerMerchantContract a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateSalesManagerMerchantContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateSalesManagerMerchantContractDto>): UpdateSalesManagerMerchantContractDto {
    const instance = new UpdateSalesManagerMerchantContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

