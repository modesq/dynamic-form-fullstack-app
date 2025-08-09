import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'full_name',
    length: 100,
    nullable: false 
  })
  fullName: string;

  @Column({ 
    length: 50,
    unique: true,
    nullable: false 
  })
  email: string;

  @Column({ 
    length: 20,
    nullable: false 
  })
  gender: string;

  @Column({ 
    name: 'love_react_flag',
    default: false 
  })
  loveReactFlag: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}