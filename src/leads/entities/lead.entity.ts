import Company from '../value-objects/company.vo.js';
import CPF from '../value-objects/cpf.vo.js';
import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';
import Name from '../value-objects/name.vo.js';
import Score from '../value-objects/score.vo.js';
import Source from '../value-objects/source.vo.js';
import Status from '../value-objects/status.vo.js';

export class Lead {
  constructor(
    readonly id: Id,
    readonly name: Name,
    readonly email: Email,
    readonly cpf: CPF,
    readonly company: Company,
    readonly source: Source,
    readonly status: Status,
    readonly score: Score,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
