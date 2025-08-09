import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormField } from '../entities/form-field.entity';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';

@Injectable()
export class FormFieldsService {
  constructor(
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
  ) {}

  async findAll(): Promise<FormField[]> {
    return await this.formFieldRepository.find({
      order: { id: 'ASC' }
    });
  }

  async findOne(id: string): Promise<FormField> {
    const formField = await this.formFieldRepository.findOne({ 
      where: { id: parseInt(id) } 
    });
    
    if (!formField) {
      throw new NotFoundException(`FormField with ID ${id} not found`);
    }
    
    return formField;
  }

  async create(createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    const formField = this.formFieldRepository.create(createFormFieldDto);
    return await this.formFieldRepository.save(formField);
  }

  async update(id: string, updateFormFieldDto: UpdateFormFieldDto): Promise<FormField> {
    const formField = await this.findOne(id);
    Object.assign(formField, updateFormFieldDto);
    return await this.formFieldRepository.save(formField);
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    const formField = await this.findOne(id);
    await this.formFieldRepository.remove(formField);
    return { 
      message: `FormField with ID ${id} has been deleted successfully`,
      id 
    };
  }

  async getDefaultFormConfig(): Promise<{ data: any[] }> {
    const formFields = await this.findAll();
    
    const data = formFields.map(field => ({
      id: field.id,
      name: field.name,
      fieldType: field.fieldType,
      ...(field.minLength && { minLength: field.minLength }),
      ...(field.maxLength && { maxLength: field.maxLength }),
      ...(field.defaultValue && { defaultValue: field.defaultValue }),
      required: field.required,
      ...(field.listOfValues && field.listOfValues.length > 0 && { 
        listOfValues1: field.listOfValues
      })
    }));
    
    return { data };
  }
}