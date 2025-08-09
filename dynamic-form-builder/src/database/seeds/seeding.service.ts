import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormField } from '../../entities/form-field.entity';

@Injectable()
export class SeedingService {
  constructor(
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
  ) {}

  async seedFormFields(): Promise<void> {
    // Check if data already exists
    const existingCount = await this.formFieldRepository.count();
    if (existingCount > 0) {
      console.log('Form fields already exist, skipping seed...');
      return;
    }

    // Sample data from the assignment
    const sampleFields = [
      {
        name: 'Full Name',
        fieldType: 'TEXT',
        minLength: 1,
        maxLength: 100,
        defaultValue: 'John Doe',
        required: true,
      },
      {
        name: 'Email',
        fieldType: 'TEXT',
        minLength: 1,
        maxLength: 50,
        defaultValue: 'hello@mail.com',
        required: true,
      },
      {
        name: 'Gender',
        fieldType: 'LIST',
        defaultValue: '1',
        required: true,
        listOfValues: ['Male', 'Female', 'Others'],
      },
      {
        name: 'Love React?',
        fieldType: 'RADIO',
        defaultValue: '1',
        required: true,
        listOfValues: ['Yes', 'No'],
      },
    ];

    // Insert sample data
    const fields = this.formFieldRepository.create(sampleFields);
    await this.formFieldRepository.save(fields);

    console.log('✅ Form fields seeded successfully');
  }

  async runAllSeeds(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    await this.seedFormFields();
    console.log('✅ All seeds completed!');
  }
}