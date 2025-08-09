import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password123',
  database: process.env.DB_NAME ?? 'dynamic_form_builder',
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
  logging: true,
};
