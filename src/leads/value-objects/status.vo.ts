export enum StatusValues {
  New = 'NEW',
  Processing = 'PROCESSING',
  Qualified = 'QUALIFIED',
  Nurture = 'NURTURE',
  Rejected = 'REJECTED',
}

export default class Status {
  private readonly _value: StatusValues;

  constructor(value: string) {
    const source = this.parseStatus(value.trim());

    if (!source) {
      throw new Error('Status inválido');
    }

    this._value = source;
  }

  get value(): StatusValues {
    return this._value;
  }

  private parseStatus(value: string): StatusValues | undefined {
    const normalizedValue = value.trim();

    return Object.values(StatusValues).find(
      (statusValue) => normalizedValue === statusValue,
    );
  }

  equals(other: Status): boolean {
    return this._value === other._value;
  }
}
