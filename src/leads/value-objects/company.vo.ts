import CNPJ from './cnpj.vo.js';

export default class Company {
  private readonly _name: string;
  private readonly _cnpj: CNPJ;

  constructor(name: string, cnpj: string) {
    const normalizedName = name.trim();

    if (normalizedName.length === 0) {
      throw new Error('Nome inválido');
    }

    this._name = normalizedName;
    this._cnpj = new CNPJ(cnpj);
  }

  get name(): string {
    return this._name;
  }

  get cnpj(): CNPJ {
    return this._cnpj;
  }

  equals(other: Company): boolean {
    return other._cnpj === this._cnpj;
  }
}
