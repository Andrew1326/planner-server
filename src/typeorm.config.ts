import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_HOST') || 'localhost',
      port: +this.configService.get<number>('POSTGRES_PORT') || 5432,
      username: this.configService.get<string>('POSTGRES_USER') || 'postgres',
      password:
        this.configService.get<string>('POSTGRES_PASSWORD') || 'postgres',
      database: this.configService.get<string>('POSTGRES_DB') || 'postgres',
      synchronize:
        !!this.configService.get<string>('POSTGRES_SYNC_SCHEMA') || false,
      migrationsRun:
        !!this.configService.get<string>('POSTGRES_SYNC_MIGRATIONS') || false,
      entities: ['dist/**/*.entity{.ts,.js}'],
    };

    return options;
  }
}
