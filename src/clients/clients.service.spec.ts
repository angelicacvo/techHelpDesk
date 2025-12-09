import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: Repository<Client>;
  let userRepository: Repository<User>;

  const mockClientRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new client successfully', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        contactEmail: 'john@example.com',
        company: 'Tech Corp',
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.CLIENT,
      };

      const mockClient = {
        id: 'client-uuid',
        ...createClientDto,
        user: mockUser,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockClientRepository.findOne.mockResolvedValue(null);
      mockClientRepository.create.mockReturnValue(mockClient);
      mockClientRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      expect(result).toEqual(mockClient);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: createClientDto.userId },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        contactEmail: 'john@example.com',
        userId: 'invalid-uuid',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createClientDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user role is not CLIENT', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        contactEmail: 'john@example.com',
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.ADMIN,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createClientDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when client profile already exists', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        contactEmail: 'john@example.com',
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.CLIENT,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockClientRepository.findOne.mockResolvedValue({ id: 'existing-client' });

      await expect(service.create(createClientDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all clients with relations', async () => {
      const mockClients = [
        {
          id: 'client-1',
          name: 'Client 1',
          user: { id: 'user-1', name: 'User 1' },
          tickets: [],
        },
      ];

      mockClientRepository.find.mockResolvedValue(mockClients);

      const result = await service.findAll();

      expect(result).toEqual(mockClients);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const clientId = 'client-uuid';
      const mockClient = {
        id: clientId,
        name: 'John Doe',
      };

      mockClientRepository.findOne.mockResolvedValue(mockClient);

      const result = await service.findOne(clientId);

      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update client successfully', async () => {
      const clientId = 'client-uuid';
      const updateClientDto: UpdateClientDto = {
        company: 'New Corp',
      };

      const existingClient = {
        id: clientId,
        name: 'John Doe',
        company: 'Old Corp',
      };

      mockClientRepository.findOne.mockResolvedValue(existingClient);
      mockClientRepository.save.mockResolvedValue({
        ...existingClient,
        ...updateClientDto,
      });

      const result = await service.update(clientId, updateClientDto);

      expect(result.company).toBe(updateClientDto.company);
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      const clientId = 'client-uuid';
      const mockClient = {
        id: clientId,
        name: 'John Doe',
      };

      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.remove.mockResolvedValue(mockClient);

      await service.remove(clientId);

      expect(mockClientRepository.remove).toHaveBeenCalledWith(mockClient);
    });
  });
});
