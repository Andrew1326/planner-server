import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';

@Injectable()
export class SystemService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analytics: AnalyticsService,
  ) {}

  // method drops database
  async databaseDrop(): Promise<IAnalytics<null | Error>> {
    try {
      // drop database
      await this.dataSource.dropDatabase();

      // success analytics
      return this.analytics.success<null>({
        message: 'Database dropped.',
        payload: null,
      });
    } catch (err) {
      // analytics fail
      return this.analytics.fail<Error>({
        message: 'Database drop fail.',
        payload: err,
      });
    }
  }
}
