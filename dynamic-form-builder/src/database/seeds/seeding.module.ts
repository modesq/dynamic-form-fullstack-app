import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { FormField } from '../../entities/form-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormField])],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}