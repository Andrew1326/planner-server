import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AnalyticsService } from "../utils/analytics/analytics.service";

@Module({
  controllers: [TaskController],
  providers: [TaskService, AnalyticsService],
})
export class TaskModule {}
