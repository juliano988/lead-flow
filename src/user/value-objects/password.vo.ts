export default class Password {
  private readonly _value: string;

  constructor(value: string) {
    if (value.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(value)) {
      throw new Error('A senha deve conter uma letra maiúscula');
    }

    if (!/[a-z]/.test(value)) {
      throw new Error('A senha deve conter uma letra minúscula');
    }

    if (!/\d/.test(value)) {
      throw new Error('A senha deve conter um numero');
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
