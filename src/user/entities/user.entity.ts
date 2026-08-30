import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';
import Name from '../value-objects/name.vo.js';
import Password from '../value-objects/password.vo.js';

export class User {
  constructor(
    readonly id: Id,
    readonly name: Name,
    readonly email: Email,
    readonly password: Password,
    readonly createdAt: Date,
  ) {}
}
