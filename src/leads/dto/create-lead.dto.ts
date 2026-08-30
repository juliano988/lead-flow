import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCpf } from '../validators/is-cpf.validator.js';
import { IsCnpj } from '../validators/is-cnpj.validator.js';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsCpf()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @IsCnpj()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
