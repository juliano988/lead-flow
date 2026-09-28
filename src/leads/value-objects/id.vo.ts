export default class Id {
  private readonly _value: string;

  constructor(value: string) {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error('ID nao pode ser vazio');
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
