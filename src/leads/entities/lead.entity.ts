import Email from '../value-objects/email.vo.js';

export class Lead {
  id: string;
  name: string;
  email: Email;
  company: string;
  source: string;
  status: string;
  score: number;
  createdAt: Date;
}
