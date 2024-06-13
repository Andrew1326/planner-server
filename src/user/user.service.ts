import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { DataSource } from 'typeorm';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import { User } from './entities/user.entity';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { Role } from 'src/role/role.enum';
import { get } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analytics: AnalyticsService,
    private readonly encryptor: EncryptorService,
  ) {}

  // method for creating a new user
  async create(
    userCreateDto: UserCreateDto,
  ): Promise<IAnalytics<string | Error>> {
    try {
      // payload for user creation
      const userCreateData: Omit<User, 'id'> = {
        roles: [Role.User],
        ...userCreateDto,
      };

      // hash user password
      userCreateData.password = await this.encryptor.hash({
        plainStr: userCreateDto.password,
        saltRounds: 10,
      });

      // insert record
      const userCreateRes = await this.dataSource
        .getRepository(User)
        .insert(userCreateData);

      // define user id
      const userId = get(userCreateRes, 'identifiers[0].id');

      // analytics success
      return this.analytics.success({
        message: 'User created.',
        payload: userId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'User create fail.',
        payload: err,
      });
    }
  }

  // method returns user by email
  async getByEmail(email: string): Promise<IAnalytics<User | Error>> {
    try {
      // get user record
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      // handler not found
      if (!user) throw new Error('User not found');

      // analytics success
      return this.analytics.success<User>({
        message: 'User get by email success.',
        payload: user,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'User get by email fail.',
        payload: err,
      });
    }
  }

  // method return user by id
  async getById(id: string): Promise<IAnalytics<User | Error>> {
    try {
      // get user record
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      // handler not found
      if (!user) throw new Error('User not found');

      // analytics success
      return this.analytics.success<User>({
        message: 'User get by id success.',
        payload: user,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'User get by id fail.',
        payload: err,
      });
    }
  }
}
