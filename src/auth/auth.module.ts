import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AuthJwtConfig } from './auth-jwt.config';
import { AuthLocalStrategy } from './auth-local.strategy';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthJwtConfig,
    }),
  ],
  providers: [
    AuthService,
    AuthLocalStrategy,
    AuthJwtStrategy,
    ConfigService,
    UserService,
    AnalyticsService,
    EncryptorService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
