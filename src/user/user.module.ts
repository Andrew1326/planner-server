import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AnalyticsService } from '../util/analytics/analytics.service';
import { EncryptorService } from '../util/encryptor/encryptor.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AnalyticsService, EncryptorService],
})
export class UserModule {}
