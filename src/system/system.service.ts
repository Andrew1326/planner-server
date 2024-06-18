import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import safeExecute from '../utils/safe-execute/safeExecute';

@Injectable()
export class SystemService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analytics: AnalyticsService,
  ) {}

  // method drops database
  async databaseDrop() {
    return safeExecute<null>({
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
