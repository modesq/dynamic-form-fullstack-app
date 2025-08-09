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
import { UsersService } from './users.service';
import { User } from '../entities/User.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch users', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.findUserByID(id);
    } catch (error) {
      throw new HttpException(
        error?.message || 'User not found', 
        HttpStatus.NOT_FOUND
      );
    }
}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(userData);
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Failed to create user', 
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      return await this.usersService.updateUserByID(id, updateUserDto);
    } catch (error) {
      if (error.message?.includes('not found')) {
        throw new HttpException(
          error.message, 
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        error.message || 'Failed to update user', 
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string; id: string }> {
    try {
      return await this.usersService.deleteUserByID(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user', 
        HttpStatus.NOT_FOUND
      );
    }
  }
}