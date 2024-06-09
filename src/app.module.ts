import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm.config';
import { AnalyticsModule } from './util/analytics/analytics.module';
import { EncryptorModule } from './util/encryptor/encryptor.module';
import { UserEntity } from './user/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AnalyticsModule,
    EncryptorModule,
    AuthModule,
  ],
})
export class AppModule {}
