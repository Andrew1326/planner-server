import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.config';
import { AnalyticsModule } from './utils/analytics/analytics.module';
import { EncryptorModule } from './utils/encryptor/encryptor.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { SystemModule } from './system/system.module';
import { TaskGroupModule } from './task-group/task-group.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AnalyticsModule,
    EncryptorModule,
    AuthModule,
    ProjectModule,
    BoardModule,
    SystemModule,
    TaskGroupModule,
    TaskModule,
  ],
})
export class AppModule {}
