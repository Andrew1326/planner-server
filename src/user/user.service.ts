import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from './user.dto';
import { DataSource, InsertResult } from 'typeorm';
import {
  AnalyticsService,
  IAnalytics,
} from '../util/analytics/analytics.service';
import { UserEntity } from './user.entity';
import { EncryptorService } from '../util/encryptor/encryptor.service';
import { IUser } from './types';
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
  async userCreate(userDTO: UserCreateDTO): Promise<IAnalytics<InsertResult>> {
    try {
      // add initial role to user dto
      userDTO.roles = [Role.User];

      // hash user password
      userDTO.password = await this.encryptor.hash({
        plainStr: userDTO.password,
        saltRounds: 10,
      });

      // insert record
      const userCreateRes = await this.dataSource
        .getRepository(UserEntity)
        .insert(userDTO);

      // define user id
      const userId = get(userCreateRes, 'identifiers[0].id');

      // analytics success
      return this.analytics.success({
        message: 'User created.',
        payload: userId,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({ message: 'User create fail.', error: err });
    }
  }

  // method returns user by email
  async userGetByEmail(email: string): Promise<IAnalytics<IUser | undefined>> {
    try {
      // get user record
      const user = await this.dataSource
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      // handler not found
      if (!user) {
        return this.analytics.fail({
          message: 'User with current email was not found.',
        });
      }

      // analytics success
      return this.analytics.success<IUser>({
        message: 'User get by email success.',
        payload: user,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail({
        message: 'User get by email fail.',
        error: err,
      });
    }
  }
}
