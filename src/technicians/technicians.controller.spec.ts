import { Test, TestingModule } from '@nestjs/testing';
import { TechniciansController } from './technicians.controller';
import { TechniciansService } from './technicians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { User } from '../users/entities/user.entity';

describe('TechniciansController', () => {
  let controller: TechniciansController;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechniciansController],
      providers: [
        TechniciansService,
        {
          provide: getRepositoryToken(Technician),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<TechniciansController>(TechniciansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
