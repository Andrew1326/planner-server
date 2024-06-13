import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { UserService } from '../user/user.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';

@Module({
  controllers: [BoardController],
  providers: [BoardService, AnalyticsService, UserService, EncryptorService],
})
export class BoardModule {}
