import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from './database/database.config';;
import { FormFieldsModule } from './form-fields/form-fields.module';
import { SeedingModule } from './database/seeds/seeding.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), SeedingModule, UsersModule, TypeOrmModule, FormFieldsModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
