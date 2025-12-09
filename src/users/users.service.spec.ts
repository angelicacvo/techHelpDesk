import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: UserRole.CLIENT,
      };

      const mockUser = {
        id: 'user-uuid',
        ...createUserDto,
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123!',
        role: UserRole.CLIENT,
      };

      const existingUser = {
        id: 'existing-uuid',
        email: createUserDto.email,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should create user with ADMIN role', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'AdminPass123!',
        role: UserRole.ADMIN,
      };

      const mockUser = {
        id: 'admin-uuid',
        ...createUserDto,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('should create user with TECHNICIAN role', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Tech User',
        email: 'tech@example.com',
        password: 'TechPass123!',
        role: UserRole.TECHNICIAN,
      };

      const mockUser = {
        id: 'tech-uuid',
        ...createUserDto,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.role).toBe(UserRole.TECHNICIAN);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'User 1',
          email: 'user1@example.com',
          role: UserRole.CLIENT,
          isActive: true,
        },
        {
          id: 'user-2',
          name: 'User 2',
          email: 'user2@example.com',
          role: UserRole.TECHNICIAN,
          isActive: true,
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'email', 'role', 'isActive'],
      });
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'user-uuid';
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CLIENT,
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'name', 'email', 'role', 'isActive'],
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = 'invalid-uuid';
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId)).rejects.toThrow(`Usuario con ID ${userId} no encontrado`);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 'user-uuid';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const existingUser = {
        id: userId,
        name: 'Original Name',
        email: 'test@example.com',
        role: UserRole.CLIENT,
        isActive: true,
      };

      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result.name).toBe(updateUserDto.name);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should update user email when new email is unique', async () => {
      const userId = 'user-uuid';
      const updateUserDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      const existingUser = {
        id: userId,
        name: 'Test User',
        email: 'oldemail@example.com',
        role: UserRole.CLIENT,
        isActive: true,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        ...updateUserDto,
      });

      const result = await service.update(userId, updateUserDto);

      expect(result.email).toBe(updateUserDto.email);
    });

    it('should throw BadRequestException when updating to existing email', async () => {
      const userId = 'user-uuid';
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = {
        id: userId,
        name: 'Test User',
        email: 'old@example.com',
        role: UserRole.CLIENT,
        isActive: true,
      };

      const anotherUser = {
        id: 'another-uuid',
        email: 'existing@example.com',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(anotherUser);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(userId, updateUserDto)).rejects.toThrow('El email ya está en uso');
    });

    it('should throw NotFoundException when user to update does not exist', async () => {
      const userId = 'invalid-uuid';
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const userId = 'user-uuid';
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CLIENT,
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(userId);

      expect(result).toEqual({ message: 'User removed successfully' });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user to remove does not exist', async () => {
      const userId = 'invalid-uuid';
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });
});
