import { Test, TestingModule } from '@nestjs/testing';
import { TechniciansService } from './technicians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

describe('TechniciansService', () => {
  let service: TechniciansService;

  const mockTechnicianRepository = {
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
        TechniciansService,
        {
          provide: getRepositoryToken(Technician),
          useValue: mockTechnicianRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TechniciansService>(TechniciansService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new technician successfully', async () => {
      const createTechnicianDto: CreateTechnicianDto = {
        specialty: 'Hardware Support',
        availability: true,
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.TECHNICIAN,
      };

      const mockTechnician = {
        id: 'technician-uuid',
        ...createTechnicianDto,
        user: mockUser,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTechnicianRepository.findOne.mockResolvedValue(null);
      mockTechnicianRepository.create.mockReturnValue(mockTechnician);
      mockTechnicianRepository.save.mockResolvedValue(mockTechnician);

      const result = await service.create(createTechnicianDto);

      expect(result).toEqual(mockTechnician);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTechnicianDto.userId },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const createTechnicianDto: CreateTechnicianDto = {
        specialty: 'Network Support',
        userId: 'invalid-uuid',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTechnicianDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when user role is not TECHNICIAN', async () => {
      const createTechnicianDto: CreateTechnicianDto = {
        specialty: 'Software Support',
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.CLIENT,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createTechnicianDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when technician profile already exists', async () => {
      const createTechnicianDto: CreateTechnicianDto = {
        specialty: 'Hardware Support',
        userId: 'user-uuid',
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.TECHNICIAN,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTechnicianRepository.findOne.mockResolvedValue({
        id: 'existing-tech',
      });

      await expect(service.create(createTechnicianDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all technicians with relations', async () => {
      const mockTechnicians = [
        {
          id: 'tech-1',
          specialty: 'Hardware',
          user: { id: 'user-1', name: 'Tech 1' },
          tickets: [],
        },
      ];

      mockTechnicianRepository.find.mockResolvedValue(mockTechnicians);

      const result = await service.findAll();

      expect(result).toEqual(mockTechnicians);
    });
  });

  describe('findOne', () => {
    it('should return a technician by id', async () => {
      const technicianId = 'technician-uuid';
      const mockTechnician = {
        id: technicianId,
        specialty: 'Network Support',
      };

      mockTechnicianRepository.findOne.mockResolvedValue(mockTechnician);

      const result = await service.findOne(technicianId);

      expect(result).toEqual(mockTechnician);
    });

    it('should throw NotFoundException when technician not found', async () => {
      mockTechnicianRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update technician successfully', async () => {
      const technicianId = 'technician-uuid';
      const updateTechnicianDto: UpdateTechnicianDto = {
        availability: false,
      };

      const existingTechnician = {
        id: technicianId,
        specialty: 'Hardware Support',
        availability: true,
      };

      mockTechnicianRepository.findOne.mockResolvedValue(existingTechnician);
      mockTechnicianRepository.save.mockResolvedValue({
        ...existingTechnician,
        ...updateTechnicianDto,
      });

      const result = await service.update(technicianId, updateTechnicianDto);

      expect(result.availability).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a technician', async () => {
      const technicianId = 'technician-uuid';
      const mockTechnician = {
        id: technicianId,
        specialty: 'Hardware Support',
      };

      mockTechnicianRepository.findOne.mockResolvedValue(mockTechnician);
      mockTechnicianRepository.remove.mockResolvedValue(mockTechnician);

      await service.remove(technicianId);

      expect(mockTechnicianRepository.remove).toHaveBeenCalledWith(
        mockTechnician,
      );
    });
  });
});
