import { formatToCPF, isCPF } from 'brazilian-values';

export default class CPF {
  private readonly _value: string;

  constructor(value: string) {
    const numericValue = value.replace(/\D/g, '');

    if (!isCPF(numericValue)) {
      throw new Error('CPF invalido');
    }

    this._value = numericValue;
  }

  get value(): string {
    return this._value;
  }

  get formattedValue(): string {
    return formatToCPF(this._value);
  }
}