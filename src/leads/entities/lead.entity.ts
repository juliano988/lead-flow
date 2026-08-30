import Email from '../value-objects/email.vo.js';
import Id from '../value-objects/id.vo.js';

export class Lead {
  id: Id;
  name: string;
  email: Email;
  company: string;
  source: string;
  status: string;
  score: number;
  createdAt: Date;
}
