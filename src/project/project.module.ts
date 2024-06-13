import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { UserService } from '../user/user.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, AnalyticsService, UserService, EncryptorService],
})
export class ProjectModule {}
