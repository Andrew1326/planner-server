import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Injectable()
export class SystemService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // method drops database
  async databaseDrop() {
    return this.analyticsService.provideAnalytics<null>({
      successMessage: 'Database drop success',
      failureMessage: 'Database drop fail',
      id: 'SYSTEM.SERVICE.DATABASE_DROP',
    })(async () => {
      // drop database
      await this.dataSource.dropDatabase();

      return null;
    });
  }
}
