import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AnalyticsService, EncryptorService],
})
export class UserModule {}
