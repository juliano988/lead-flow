import { isCNPJ } from 'brazilian-values';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsCnpj(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isCNPJ(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} deve conter um CNPJ valido`;
        },
      },
    });
  };
}
