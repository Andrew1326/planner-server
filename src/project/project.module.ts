import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { UserService } from '../user/user.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { BoardService } from '../board/board.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    AnalyticsService,
    UserService,
    EncryptorService,
    BoardService,
  ],
})
export class ProjectModule {}
