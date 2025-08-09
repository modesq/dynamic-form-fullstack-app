import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { FormFieldsService } from './form-fields.service';
import { FormField } from '../entities/form-field.entity';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  @Get()
  async findAll(): Promise<FormField[]> {
    try {
      return await this.formFieldsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch form fields', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('config')
  async getFormConfig(): Promise<{ data: any[] }> {
    try {
      return await this.formFieldsService.getDefaultFormConfig();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch form configuration', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FormField> {
    try {
      return await this.formFieldsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Form field not found', 
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post()
  async create(@Body() createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    try {
      return await this.formFieldsService.create(createFormFieldDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create form field: ${error.message}`, 
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormFieldDto: UpdateFormFieldDto
  ): Promise<FormField> {
    try {
      return await this.formFieldsService.update(id, updateFormFieldDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update form field', 
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string; id: string }> {
    try {
      return await this.formFieldsService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete form field', 
        HttpStatus.NOT_FOUND
      );
    }
  }
}