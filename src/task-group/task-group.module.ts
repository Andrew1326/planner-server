import { Module } from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { TaskGroupController } from './task-group.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { UserService } from '../user/user.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { TaskService } from '../task/task.service';

@Module({
  controllers: [TaskGroupController],
  providers: [
    TaskGroupService,
    AnalyticsService,
    UserService,
    TaskService,
    EncryptorService,
  ],
})
export class TaskGroupModule {}
