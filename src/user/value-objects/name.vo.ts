export default class Name {
  private readonly _firstName: string;
  private readonly _lastName: string;

  constructor(firstName: string, lastName: string) {
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (normalizedFirstName.length === 0 || normalizedLastName.length === 0) {
      throw new Error('Nome inválido');
    }

    this._firstName = normalizedFirstName;
    this._lastName = normalizedLastName;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  equals(other: Name): boolean {
    return (
      this._firstName === other._firstName && this._lastName === other._lastName
    );
  }
}
