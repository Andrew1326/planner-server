import { Module } from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { TaskGroupController } from './task-group.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { UserService } from '../user/user.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';

@Module({
  controllers: [TaskGroupController],
  providers: [
    TaskGroupService,
    AnalyticsService,
    UserService,
    EncryptorService,
  ],
})
export class TaskGroupModule {}
