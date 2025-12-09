import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Hardware',
        description: 'Hardware issues',
      };

      const mockCategory = {
        id: 'category-uuid',
        ...createCategoryDto,
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { name: createCategoryDto.name },
      });
    });

    it('should throw BadRequestException when category name already exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Existing Category',
      };

      mockCategoryRepository.findOne.mockResolvedValue({ id: 'existing-uuid' });

      await expect(service.create(createCategoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all categories with tickets', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Hardware', tickets: [] },
        { id: 'cat-2', name: 'Software', tickets: [] },
      ];

      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        relations: ['tickets'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = 'category-uuid';
      const mockCategory = {
        id: categoryId,
        name: 'Hardware',
        tickets: [],
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(categoryId);

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const categoryId = 'category-uuid';
      const updateCategoryDto: UpdateCategoryDto = {
        description: 'Updated description',
      };

      const existingCategory = {
        id: categoryId,
        name: 'Hardware',
        description: 'Old description',
      };

      mockCategoryRepository.findOne.mockResolvedValue(existingCategory);
      mockCategoryRepository.save.mockResolvedValue({
        ...existingCategory,
        ...updateCategoryDto,
      });

      const result = await service.update(categoryId, updateCategoryDto);

      expect(result.description).toBe(updateCategoryDto.description);
    });

    it('should throw BadRequestException when updating to existing name', async () => {
      const categoryId = 'category-uuid';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Existing Name',
      };

      const existingCategory = {
        id: categoryId,
        name: 'Original Name',
      };

      mockCategoryRepository.findOne
        .mockResolvedValueOnce(existingCategory)
        .mockResolvedValueOnce({ id: 'another-uuid' });

      await expect(service.update(categoryId, updateCategoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = 'category-uuid';
      const mockCategory = {
        id: categoryId,
        name: 'Hardware',
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(mockCategory);

      await service.remove(categoryId);

      expect(mockCategoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });
  });
});
