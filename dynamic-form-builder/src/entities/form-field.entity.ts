import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JsonArrayTransformer } from '../transformers/json-array.transformer';

@Entity('form_fields')
export class FormField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ 
    name: 'field_type',
    length: 20 
  })
  fieldType: string; // 'TEXT', 'LIST', 'RADIO'

  @Column({ 
    name: 'min_length',
    nullable: true 
  })
  minLength?: number;

  @Column({ 
    name: 'max_length',
    nullable: true 
  })
  maxLength?: number;

  @Column({ 
    name: 'default_value',
    nullable: true 
  })
  defaultValue?: string;

  @Column({ default: false })
  required: boolean;

  @Column({ 
    name: 'list_of_values',
    type: 'text',
    nullable: true,
    transformer: new JsonArrayTransformer<string>([])
  })
  listOfValues?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}