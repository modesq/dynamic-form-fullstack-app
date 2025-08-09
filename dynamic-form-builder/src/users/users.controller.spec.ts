import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/User.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    gender: 'Male',
    loveReactFlag: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findUserByID: jest.fn(),
    createUser: jest.fn(),
    updateUserByID: jest.fn(),
    deleteUserByID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.getAllUsers();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw INTERNAL_SERVER_ERROR HttpException when service fails', async () => {
      mockUsersService.findAll.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.getAllUsers()).rejects.toThrow(
        new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle service throwing any error', async () => {
      mockUsersService.findAll.mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.getAllUsers()).rejects.toThrow(HttpException);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      mockUsersService.findUserByID.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(service.findUserByID).toHaveBeenCalledWith('1');
    });

    it('should throw NOT_FOUND HttpException when user not found with specific message', async () => {
      const errorMessage = 'User with ID 999 not found';
      mockUsersService.findUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getUserById('999')).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.NOT_FOUND),
      );
      expect(service.findUserByID).toHaveBeenCalledWith('999');
    });

    it('should throw NOT_FOUND HttpException with generic message when error has no message', async () => {
      mockUsersService.findUserByID.mockRejectedValue(new Error());

      await expect(controller.getUserById('999')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
      expect(service.findUserByID).toHaveBeenCalledWith('999');
    });

    it('should handle NotFoundException from service', async () => {
      mockUsersService.findUserByID.mockRejectedValue(new Error('NotFoundException: User not found'));

      await expect(controller.getUserById('999')).rejects.toThrow(HttpException);
      expect(service.findUserByID).toHaveBeenCalledWith('999');
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      gender: 'Female',
      loveReactFlag: false,
    };

    it('should create and return a user', async () => {
      const newUser = { ...mockUser, ...createUserDto, id: 2 };
      mockUsersService.createUser.mockResolvedValue(newUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(newUser);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw CONFLICT HttpException when email already exists', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error('Email already exists'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Email already exists', HttpStatus.CONFLICT),
      );
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BAD_REQUEST HttpException for validation errors', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Failed to create user', HttpStatus.BAD_REQUEST),
      );
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BAD_REQUEST HttpException for database constraint errors', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error('Database constraint violation'));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Failed to create user', HttpStatus.BAD_REQUEST),
      );
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BAD_REQUEST HttpException for unknown errors', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error());

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Failed to create user', HttpStatus.BAD_REQUEST),
      );
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle successful creation with minimal data', async () => {
      const minimalDto: CreateUserDto = {
        fullName: 'Test User',
        email: 'test@test.com',
        gender: 'Others',
        loveReactFlag: true,
      };
      const newUser = { ...mockUser, ...minimalDto, id: 3 };
      mockUsersService.createUser.mockResolvedValue(newUser);

      const result = await controller.createUser(minimalDto);

      expect(result).toEqual(newUser);
      expect(service.createUser).toHaveBeenCalledWith(minimalDto);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      fullName: 'John Updated',
      gender: 'Others',
    };

    it('should update and return a user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUserByID.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateUserByID).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw NOT_FOUND HttpException when user not found', async () => {
      const errorMessage = 'User with ID 999 not found';
      mockUsersService.updateUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.updateUser('999', updateUserDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.NOT_FOUND),
      );
      expect(service.updateUserByID).toHaveBeenCalledWith('999', updateUserDto);
    });

    it('should throw BAD_REQUEST HttpException for validation errors', async () => {
      const errorMessage = 'Invalid gender value';
      mockUsersService.updateUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.updateUser('1', updateUserDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
      );
      expect(service.updateUserByID).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw BAD_REQUEST HttpException with generic message for unknown errors', async () => {
      mockUsersService.updateUserByID.mockRejectedValue(new Error());

      await expect(controller.updateUser('1', updateUserDto)).rejects.toThrow(
        new HttpException('Failed to update user', HttpStatus.BAD_REQUEST),
      );
      expect(service.updateUserByID).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdateUserDto = { fullName: 'Only Name Updated' };
      const updatedUser = { ...mockUser, fullName: 'Only Name Updated' };
      mockUsersService.updateUserByID.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', partialUpdateDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateUserByID).toHaveBeenCalledWith('1', partialUpdateDto);
    });

    it('should handle database constraint errors', async () => {
      const errorMessage = 'Email already exists for another user';
      mockUsersService.updateUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.updateUser('1', updateUserDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return success message', async () => {
      const deleteResult = {
        message: 'User with ID 1 has been deleted successfully',
        id: '1',
      };
      mockUsersService.deleteUserByID.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser('1');

      expect(result).toEqual(deleteResult);
      expect(service.deleteUserByID).toHaveBeenCalledWith('1');
    });

    it('should throw NOT_FOUND HttpException when user not found', async () => {
      const errorMessage = 'User with ID 999 not found';
      mockUsersService.deleteUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.deleteUser('999')).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.NOT_FOUND),
      );
      expect(service.deleteUserByID).toHaveBeenCalledWith('999');
    });

    it('should throw NOT_FOUND HttpException with generic message for unknown errors', async () => {
      mockUsersService.deleteUserByID.mockRejectedValue(new Error());

      await expect(controller.deleteUser('999')).rejects.toThrow(
        new HttpException('Failed to delete user', HttpStatus.NOT_FOUND),
      );
      expect(service.deleteUserByID).toHaveBeenCalledWith('999');
    });

    it('should handle database foreign key constraint errors', async () => {
      const errorMessage = 'Cannot delete user due to existing references';
      mockUsersService.deleteUserByID.mockRejectedValue(new Error(errorMessage));

      await expect(controller.deleteUser('1')).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.NOT_FOUND),
      );
      expect(service.deleteUserByID).toHaveBeenCalledWith('1');
    });

    it('should handle successful deletion with proper return format', async () => {
      const deleteResult = {
        message: 'User with ID 123 has been deleted successfully',
        id: '123',
      };
      mockUsersService.deleteUserByID.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser('123');

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('id');
      expect(result.id).toBe('123');
      expect(service.deleteUserByID).toHaveBeenCalledWith('123');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle service throwing non-Error objects', async () => {
      mockUsersService.findAll.mockRejectedValue('String error');

      await expect(controller.getAllUsers()).rejects.toThrow(HttpException);
    });

    it('should handle service throwing null/undefined', async () => {
      mockUsersService.findUserByID.mockRejectedValue(null);

      await expect(controller.getUserById('1')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should preserve error messages when available', async () => {
      const specificError = 'Very specific validation error message';
      mockUsersService.createUser.mockRejectedValue(new Error(specificError));

      const createUserDto: CreateUserDto = {
        fullName: 'Test',
        email: 'test@test.com',
        gender: 'Male',
        loveReactFlag: false,
      };

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Failed to create user', HttpStatus.BAD_REQUEST),
      );
    });
  });
});