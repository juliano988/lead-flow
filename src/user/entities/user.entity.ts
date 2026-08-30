import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';
import Name from '../value-objects/name.vo.js';

export class User {
  constructor(
    readonly id: Id,
    readonly name: Name,
    readonly email: Email,
    readonly passwordHash: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
