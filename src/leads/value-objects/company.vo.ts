import { isCNPJ } from 'brazilian-values';

export default class Company {
  private readonly _name: string;
  private readonly _cnpj: string;

  constructor(name: string, cnpj: string) {
    const normalizedName = name.trim();
    const normalizedCnpj = cnpj.trim();

    if (normalizedName.length === 0) {
      throw new Error('Nome inválido');
    }

    if (!isCNPJ(normalizedCnpj)) {
      throw new Error('CNPJ inválido');
    }

    this._name = normalizedName;
    this._cnpj = normalizedCnpj;
  }

  get name(): string {
    return this._name;
  }

  get cnpj(): string {
    return this._cnpj;
  }

  equals(other: Company): boolean {
    return other._cnpj === this._cnpj;
  }
}
