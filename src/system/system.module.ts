import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService, AnalyticsService],
})
export class SystemModule {}
