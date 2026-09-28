import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, type UserSummary } from './entities/user.entity.js';
import { UserRecord } from './schemas/user.schema.js';
import Email from './value-objects/email.vo.js';
import Id from './value-objects/id.vo.js';
import Name from './value-objects/name.vo.js';

export interface CreateUserInput {
  name: Name;
  email: Email;
  passwordHash: string;
}
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserRecord.name)
    private readonly userModel: Model<UserRecord>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    if (await this.existByEmail(createUserInput.email.value)) {
      throw new ConflictException('E-mail já cadastrado');
    }

    try {
      const user = await this.userModel.create({
        firstName: createUserInput.name.firstName,
        lastName: createUserInput.name.lastName,
        email: createUserInput.email.value,
        passwordHash: createUserInput.passwordHash,
      });

      return this.toDomain(user);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw error;
    }
  }

  async find(page: number, pageSize: number): Promise<UserSummary[]> {
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1
    ) {
      throw new BadRequestException(
        'Página e tamanho devem ser inteiros positivos',
      );
    }

    const skip = (page - 1) * pageSize;

    const users = await this.userModel.find().skip(skip).limit(pageSize).lean();

    return users.map((user) => this.toSummary(user));
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async findByEmail(email: string): Promise<User> {
    const normalizedEmail = new Email(email).value;
    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .select('+passwordHash')
      .lean();

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return this.toDomain(user);
  }

  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    const user = await this.userModel
      .findById(id)
      .select('+passwordHash')
      .lean();

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return this.toDomain(user);
  }

  async existById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    return (await this.userModel.exists({ _id: id }).exec()) !== null;
  }

  async existByEmail(email: string): Promise<boolean> {
    const normalizedEmail = new Email(email).value;

    return (
      (await this.userModel.exists({ email: normalizedEmail }).exec()) !== null
    );
  }

  private toDomain(user: UserRecord): User {
    return new User(
      new Id(user._id.toString()),
      new Name(user.firstName, user.lastName),
      new Email(user.email),
      user.passwordHash,
      user.createdAt,
      user.updatedAt,
    );
  }

  private toSummary(user: UserRecord): UserSummary {
    return {
      id: new Id(user._id.toString()),
      name: new Name(user.firstName, user.lastName),
      email: new Email(user.email),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
