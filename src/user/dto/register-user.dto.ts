import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter uma letra maiúscula',
  })
  @Matches(/[a-z]/, {
    message: 'A senha deve conter uma letra minúscula',
  })
  @Matches(/\d/, {
    message: 'A senha deve conter um numero',
  })
  password: string;
}
