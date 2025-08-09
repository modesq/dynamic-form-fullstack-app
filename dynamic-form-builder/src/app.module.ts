import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from './config/database.config';;
import { FormFieldsModule } from './form-fields/form-fields.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UsersModule, TypeOrmModule, FormFieldsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
