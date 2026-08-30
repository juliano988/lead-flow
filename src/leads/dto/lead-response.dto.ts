import { ScoreClassification } from '../value-objects/score.vo.js';
import { SourceValues } from '../value-objects/source.vo.js';
import { StatusValues } from '../value-objects/status.vo.js';

export default class LeadResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  company: {
    name: string;
    cnpj: string;
  };
  source: SourceValues;
  status: StatusValues;
  score: {
    value: number;
    classification: ScoreClassification;
  };
  createdAt: Date;
  updatedAt: Date;
}
