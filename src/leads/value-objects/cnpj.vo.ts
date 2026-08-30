import { formatToCNPJ, isCNPJ } from 'brazilian-values';

export default class CNPJ {
  private readonly _value: string;

  constructor(value: string) {
    const numericValue = value.replace(/\D/g, '');

    if (!isCNPJ(numericValue)) {
      throw new Error('CNPJ invalido');
    }

    this._value = numericValue;
  }

  get value(): string {
    return this._value;
  }

  get formattedValue(): string {
    return formatToCNPJ(this._value);
  }
}
