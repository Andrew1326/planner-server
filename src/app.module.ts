import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.config';
import { AnalyticsModule } from './utils/analytics/analytics.module';
import { EncryptorModule } from './utils/encryptor/encryptor.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AnalyticsModule,
    EncryptorModule,
    AuthModule,
    ProjectModule,
  ],
})
export class AppModule {}
