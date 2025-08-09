import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findUserByID(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const singleUserData = Array.isArray(createUserDto) ? createUserDto[0] : createUserDto;
      const user = this.userRepository.create(singleUserData);

      const savedUser = await this.userRepository.save(user);
      return savedUser as unknown as User;
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async updateUserByID(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserByID(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async deleteUserByID(id: string): Promise<{ message: string; id: string }> {
    const user = await this.findUserByID(id);
    await this.userRepository.remove(user);
    return {
      message: `User with ID ${id} has been deleted successfully`,
      id,
    };
  }
}
