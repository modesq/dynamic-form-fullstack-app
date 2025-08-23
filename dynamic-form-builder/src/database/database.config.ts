import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5433),
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASSWORD', 'password123'),
  database: configService.get('DB_NAME', 'dynamic_form_builder'),
  entities: ['dist/**/*.entity.js'],
  synchronize: configService.get('NODE_ENV', 'development') === 'development',
  logging: configService.get('NODE_ENV', 'development') === 'development',
});