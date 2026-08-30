import Company from '../value-objects/company.vo.js';
import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';
import Name from '../value-objects/name.vo.js';

export class Lead {
  id: Id;
  name: Name;
  email: Email;
  company: Company;
  source: string;
  status: string;
  score: number;
  createdAt: Date;
}
