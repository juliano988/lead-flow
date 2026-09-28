import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity.js';
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

    const user = await this.userModel.create({
      firstName: createUserInput.name.firstName,
      lastName: createUserInput.name.lastName,
      email: createUserInput.email.value,
      passwordHash: createUserInput.passwordHash,
    });

    return this.toDomain(user);
  }

  async find(page: number, pageSize: number): Promise<User[]> {
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

    return users.map((user) => this.toDomain(user));
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: new Email(email).value })
      .lean();

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return this.toDomain(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('Usuário nao encontrado');
    }

    return this.toDomain(user);
  }

  async existById(id: string): Promise<boolean> {
    return Boolean(await this.userModel.exists({ _id: id }).exec());
  }

  async existByEmail(email: string): Promise<boolean> {
    return Boolean(
      await this.userModel.exists({ email: new Email(email).value }).exec(),
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
}
