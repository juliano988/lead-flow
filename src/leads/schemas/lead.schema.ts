import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SourceValues } from '../value-objects/source.vo.js';
import { StatusValues } from '../value-objects/status.vo.js';

@Schema({ _id: false, id: false })
export class CompanyRecord {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  cnpj: string;
}

const CompanySchema = SchemaFactory.createForClass(CompanyRecord);

@Schema({
  collection: 'leads',
  timestamps: true,
  versionKey: false,
})
export class LeadRecord {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  cpf: string;

  @Prop({ type: CompanySchema, required: true })
  company: CompanyRecord;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(SourceValues),
  })
  source: SourceValues;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(StatusValues),
    default: StatusValues.New,
  })
  status: StatusValues;

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  score: number;

  createdAt: Date;
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(LeadRecord);
