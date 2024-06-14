import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { ProjectService } from "../project/project.service";

@Module({
  controllers: [UserController],
  providers: [UserService, AnalyticsService, EncryptorService, ProjectService],
})
export class UserModule {}
