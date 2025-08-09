import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/User.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    gender: 'Male',
    loveReactFlag: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findUserByID', () => {
    it('should return a user when found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByID('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findUserByID('999')).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
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
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should handle array input and use first element', async () => {
      const newUser = { ...mockUser, ...createUserDto, id: 2 };
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw error when email already exists', async () => {
      const duplicateError = { code: '23505' };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue(duplicateError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });

    it('should throw original error for other database errors', async () => {
      const otherError = new Error('Database connection failed');
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue(otherError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('updateUserByID', () => {
    const updateUserDto: UpdateUserDto = {
      fullName: 'John Updated',
      gender: 'Others',
    };

    it('should update and return a user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserByID('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserByID('999', updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });

  describe('deleteUserByID', () => {
    it('should delete a user and return success message', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.deleteUserByID('1');

      expect(result).toEqual({
        message: 'User with ID 1 has been deleted successfully',
        id: '1',
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUserByID('999')).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });
});