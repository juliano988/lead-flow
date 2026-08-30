import Company from '../value-objects/company.vo.js';
import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';
import Name from '../value-objects/name.vo.js';
import Score from '../value-objects/score.vo.js';
import Source from '../value-objects/source.vo.js';
import Status from '../value-objects/status.vo.js';

export class Lead {
  id: Id;
  name: Name;
  email: Email;
  company: Company;
  source: Source;
  status: Status;
  score: Score;
  createdAt: Date;
}
