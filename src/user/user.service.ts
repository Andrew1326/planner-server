import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { Role } from 'src/role/role.enum';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly encryptor: EncryptorService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // method for a new user creation
  create(userCreateDto: UserCreateDto) {
    return this.analyticsService.provide<User>({
      successMessage: 'User create success',
      failureMessage: 'User create fail',
      id: 'USER.SERVICE.CREATE',
    })(async () => {
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
      const userId = userCreateRes.identifiers[0].id;

      return userId;
    });
  }

  // method returns user by email
  getByEmail(email: string) {
    return this.analyticsService.provide<User>({
      successMessage: 'User get by email success',
      failureMessage: 'User get by email fail',
      id: 'USER.SERVICE.GET_BY_EMAIL',
    })(async () => {
      // get user record
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      // handler not found
      if (!user) throw new Error('User not found');

      return user;
    });
  }

  // method returns user by id
  async findById(id: string) {
    return this.analyticsService.provide<User>({
      successMessage: 'User by id success',
      failureMessage: 'User get by id fail',
      id: 'USER.SERVICE.FIND_BY_ID',
    })(async () => {
      // get user record
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      // handler not found
      if (!user) throw new Error('User not found');

      return user;
    });
  }
}
