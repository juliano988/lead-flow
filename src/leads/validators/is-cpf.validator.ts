import { isCPF } from 'brazilian-values';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsCpf(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isCPF(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} deve conter um CPF valido`;
        },
      },
    });
  };
}
