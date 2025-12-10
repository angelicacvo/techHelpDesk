import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TicketStatus } from '../common/enums/ticket-status.enum';
import { TicketPriority } from '../common/enums/ticket-priority.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: Repository<Ticket>;
  let categoryRepository: Repository<Category>;
  let clientRepository: Repository<Client>;
  let technicianRepository: Repository<Technician>;

  const mockTicketRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  const mockClientRepository = {
    findOne: jest.fn(),
  };

  const mockTechnicianRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
        {
          provide: getRepositoryToken(Technician),
          useValue: mockTechnicianRepository,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    clientRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
    technicianRepository = module.get<Repository<Technician>>(
      getRepositoryToken(Technician),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create (Priority Test 1)', () => {
    it('should create a ticket successfully', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Printer not working',
        description: 'The office printer is not responding',
        priority: TicketPriority.HIGH,
        categoryId: 'category-uuid',
        clientId: 'client-uuid',
      };

      const mockCategory = { id: 'category-uuid', name: 'Hardware' };
      const mockClient = { id: 'client-uuid', name: 'John Doe' };
      const mockTicket = {
        id: 'ticket-uuid',
        ...createTicketDto,
        category: mockCategory,
        client: mockClient,
        status: TicketStatus.OPEN,
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockTicketRepository.create.mockReturnValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(mockTicket);

      const result = await service.create(createTicketDto);

      expect(result).toEqual(mockTicket);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTicketDto.categoryId },
      });
      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTicketDto.clientId },
      });
      expect(mockTicketRepository.create).toHaveBeenCalledWith({
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority,
        category: mockCategory,
        client: mockClient,
        technician: undefined,
        status: TicketStatus.OPEN,
      });
      expect(mockTicketRepository.save).toHaveBeenCalledWith(mockTicket);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
        categoryId: 'invalid-category-uuid',
        clientId: 'client-uuid',
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTicketDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when client does not exist', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
        categoryId: 'category-uuid',
        clientId: 'invalid-client-uuid',
      };

      const mockCategory = { id: 'category-uuid', name: 'Hardware' };
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTicketDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClientRepository.findOne).toHaveBeenCalled();
    });

    it('should create ticket with technician when provided', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Network Issue',
        description: 'Network connectivity problems',
        priority: TicketPriority.CRITICAL,
        categoryId: 'category-uuid',
        clientId: 'client-uuid',
        technicianId: 'technician-uuid',
      };

      const mockCategory = { id: 'category-uuid', name: 'Network' };
      const mockClient = { id: 'client-uuid', name: 'Jane Smith' };
      const mockTechnician = {
        id: 'technician-uuid',
        specialty: 'Network Support',
      };
      const mockTicket = {
        id: 'ticket-uuid',
        ...createTicketDto,
        category: mockCategory,
        client: mockClient,
        technician: mockTechnician,
        status: TicketStatus.OPEN,
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockTechnicianRepository.findOne.mockResolvedValue(mockTechnician);
      mockTicketRepository.count.mockResolvedValue(2);
      mockTicketRepository.create.mockReturnValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(mockTicket);

      const result = await service.create(createTicketDto);

      expect(result).toEqual(mockTicket);
      expect(mockTechnicianRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTicketDto.technicianId },
      });
      expect(mockTicketRepository.count).toHaveBeenCalled();
    });

    it('should throw BadRequestException when technician has 5 or more in-progress tickets', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.LOW,
        categoryId: 'category-uuid',
        clientId: 'client-uuid',
        technicianId: 'technician-uuid',
      };

      const mockCategory = { id: 'category-uuid', name: 'Software' };
      const mockClient = { id: 'client-uuid', name: 'Test Client' };
      const mockTechnician = {
        id: 'technician-uuid',
        specialty: 'Software Support',
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockTechnicianRepository.findOne.mockResolvedValue(mockTechnician);
      mockTicketRepository.count.mockResolvedValue(5);

      await expect(service.create(createTicketDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockTicketRepository.count).toHaveBeenCalledWith({
        where: {
          technician: { id: createTicketDto.technicianId },
          status: TicketStatus.IN_PROGRESS,
        },
      });
    });
  });

  describe('updateStatus (Priority Test 2)', () => {
    it('should update ticket status successfully from OPEN to IN_PROGRESS', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.IN_PROGRESS,
      };

      const mockUser = {
        id: 'user-uuid',
        email: 'admin@test.com',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        title: 'Test Ticket',
        status: TicketStatus.OPEN,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
        technician: { id: 'tech-uuid', user: { id: 'tech-user-uuid' } },
      };

      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(updatedTicket);

      const result = await service.updateStatus(
        ticketId,
        updateStatusDto,
        mockUser as any,
      );

      expect(result.status).toBe(TicketStatus.IN_PROGRESS);
      expect(mockTicketRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: TicketStatus.IN_PROGRESS }),
      );
    });

    it('should update ticket status from IN_PROGRESS to RESOLVED', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.RESOLVED,
      };

      const mockUser = {
        id: 'user-uuid',
        email: 'admin@test.com',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        title: 'Test Ticket',
        status: TicketStatus.IN_PROGRESS,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
        technician: { id: 'tech-uuid', user: { id: 'tech-user-uuid' } },
      };

      const updatedTicket = { ...mockTicket, status: TicketStatus.RESOLVED };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(updatedTicket);

      const result = await service.updateStatus(
        ticketId,
        updateStatusDto,
        mockUser as any,
      );

      expect(result.status).toBe(TicketStatus.RESOLVED);
    });

    it('should update ticket status from RESOLVED to CLOSED', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.CLOSED,
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.RESOLVED,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
        technician: { id: 'tech-uuid', user: { id: 'tech-user-uuid' } },
      };

      const updatedTicket = { ...mockTicket, status: TicketStatus.CLOSED };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(updatedTicket);

      const result = await service.updateStatus(
        ticketId,
        updateStatusDto,
        mockUser as any,
      );

      expect(result.status).toBe(TicketStatus.CLOSED);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.OPEN,
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.RESOLVED,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      await expect(
        service.updateStatus(ticketId, updateStatusDto, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when trying to update same status', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.OPEN,
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.OPEN,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      await expect(
        service.updateStatus(ticketId, updateStatusDto, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when trying to update closed ticket', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.OPEN,
      };

      const mockUser = {
        id: 'user-uuid',
        role: UserRole.ADMIN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.CLOSED,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      await expect(
        service.updateStatus(ticketId, updateStatusDto, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException when technician tries to update ticket not assigned to them', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.IN_PROGRESS,
      };

      const mockUser = {
        id: 'different-user-uuid',
        role: UserRole.TECHNICIAN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.OPEN,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
        technician: { id: 'tech-uuid', user: { id: 'tech-user-uuid' } },
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      await expect(
        service.updateStatus(ticketId, updateStatusDto, mockUser as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow technician to update their own assigned ticket', async () => {
      const ticketId = 'ticket-uuid';
      const updateStatusDto: UpdateTicketStatusDto = {
        status: TicketStatus.IN_PROGRESS,
      };

      const mockUser = {
        id: 'tech-user-uuid',
        role: UserRole.TECHNICIAN,
      };

      const mockTicket = {
        id: ticketId,
        status: TicketStatus.OPEN,
        category: { id: 'cat-uuid' },
        client: { id: 'client-uuid' },
        technician: { id: 'tech-uuid', user: { id: 'tech-user-uuid' } },
      };

      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(updatedTicket);

      const result = await service.updateStatus(
        ticketId,
        updateStatusDto,
        mockUser as any,
      );

      expect(result.status).toBe(TicketStatus.IN_PROGRESS);
    });
  });

  describe('findAll', () => {
    it('should return all tickets with relations', async () => {
      const mockTickets = [
        {
          id: 'ticket-1',
          title: 'Ticket 1',
          status: TicketStatus.OPEN,
          category: { id: 'cat-1', name: 'Hardware' },
          client: { id: 'client-1', name: 'Client 1', user: { id: 'user-1' } },
          technician: {
            id: 'tech-1',
            specialty: 'Hardware',
            user: { id: 'user-2' },
          },
        },
        {
          id: 'ticket-2',
          title: 'Ticket 2',
          status: TicketStatus.IN_PROGRESS,
          category: { id: 'cat-2', name: 'Software' },
          client: { id: 'client-2', name: 'Client 2', user: { id: 'user-3' } },
          technician: {
            id: 'tech-2',
            specialty: 'Software',
            user: { id: 'user-4' },
          },
        },
      ];

      mockTicketRepository.find.mockResolvedValue(mockTickets);

      const result = await service.findAll();

      expect(result).toEqual(mockTickets);
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        relations: [
          'category',
          'client',
          'technician',
          'client.user',
          'technician.user',
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a ticket by id', async () => {
      const ticketId = 'ticket-uuid';
      const mockTicket = {
        id: ticketId,
        title: 'Test Ticket',
        status: TicketStatus.OPEN,
        category: { id: 'cat-uuid', name: 'Hardware' },
        client: { id: 'client-uuid', name: 'Client' },
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      const result = await service.findOne(ticketId);

      expect(result).toEqual(mockTicket);
      expect(mockTicketRepository.findOne).toHaveBeenCalledWith({
        where: { id: ticketId },
        relations: [
          'category',
          'client',
          'technician',
          'client.user',
          'technician.user',
        ],
      });
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      const ticketId = 'invalid-uuid';
      mockTicketRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(ticketId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByClient', () => {
    it('should return tickets by client id', async () => {
      const clientId = 'client-uuid';
      const mockTickets = [
        {
          id: 'ticket-1',
          title: 'Ticket 1',
          client: { id: clientId },
        },
      ];

      mockTicketRepository.find.mockResolvedValue(mockTickets);

      const result = await service.findByClient(clientId);

      expect(result).toEqual(mockTickets);
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        where: { client: { id: clientId } },
        relations: ['category', 'client', 'technician', 'technician.user'],
      });
    });
  });

  describe('findByTechnician', () => {
    it('should return tickets by technician id', async () => {
      const technicianId = 'technician-uuid';
      const mockTickets = [
        {
          id: 'ticket-1',
          title: 'Ticket 1',
          technician: { id: technicianId },
        },
      ];

      mockTicketRepository.find.mockResolvedValue(mockTickets);

      const result = await service.findByTechnician(technicianId);

      expect(result).toEqual(mockTickets);
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        where: { technician: { id: technicianId } },
        relations: ['category', 'client', 'technician', 'client.user'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a ticket', async () => {
      const ticketId = 'ticket-uuid';
      const mockTicket = {
        id: ticketId,
        title: 'Test Ticket',
        status: TicketStatus.OPEN,
      };

      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.remove.mockResolvedValue(mockTicket);

      await service.remove(ticketId);

      expect(mockTicketRepository.remove).toHaveBeenCalledWith(mockTicket);
    });

    it('should throw NotFoundException when trying to remove non-existent ticket', async () => {
      const ticketId = 'invalid-uuid';
      mockTicketRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(ticketId)).rejects.toThrow(NotFoundException);
    });
  });
});
