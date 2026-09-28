import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsCnpj } from '../validators/is-cnpj.validator.js';
import { IsCpf } from '../validators/is-cpf.validator.js';
import { SourceValues } from '../value-objects/source.vo.js';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123.456.789-09',
    description: 'CPF valido do lead',
  })
  @IsString()
  @IsNotEmpty()
  @IsCpf()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: '12.345.678/0001-99',
    description: 'CNPJ valido do lead',
  })
  @IsString()
  @IsNotEmpty()
  @IsCnpj()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(SourceValues)
  @ApiProperty({
    enum: SourceValues,
    example: SourceValues.LandingPage,
  })
  source: string;
}
