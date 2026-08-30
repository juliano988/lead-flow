import { isUUID } from 'class-validator';

export default class Id {
  private readonly _value: string;

  constructor(value: string) {
    const normalizedValue = value.trim();

    if (!isUUID(normalizedValue, '4')) {
      throw new Error('ID deve ser um UUID v4 valido');
    }

    this._value = normalizedValue;
  }

  get value() {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other._value;
  }
}
