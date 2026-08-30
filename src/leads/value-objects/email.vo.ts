export default class Email {
  private readonly _value: string;

  constructor(value: string) {
    const normalizedValue = value.trim().toLocaleLowerCase();

    if (!Email.isValid(normalizedValue)) {
      throw new Error('Email invalido');
    }

    this._value = normalizedValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
