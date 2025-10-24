import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { mockCategories } from 'test/mocks/category.mock';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: Repository<Category>;

  beforeEach(async () => {
    const mockCategoriesRepository: Partial<Repository<Category>> = {
      create: jest.fn().mockImplementation((createCategoryDto: CreateCategoryDto) => { return { id: '0', ...createCategoryDto } }),
      save: jest.fn().mockImplementation((category: Category) => Promise.resolve(category)),
      remove: jest.fn().mockImplementation((category: Category) => Promise.resolve(category)),
      existsBy: jest.fn().mockImplementation(({ name }) => Promise.resolve(mockCategories.some((category: Category) => category.name === name))),
      find: jest.fn().mockResolvedValue(mockCategories),
      findOne: jest.fn().mockImplementation(({ where: { id: id } }) => Promise.resolve(mockCategories.find((category: Category) => category.id === id) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: getRepositoryToken(Category), useValue: mockCategoriesRepository }]
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Baz' };

      const category: Category = await categoriesService.create(createCategoryDto);

      expect(category).toEqual(plainToInstance(Category, { id: '0', ...createCategoryDto }));
    });

    it('should throw a ConflictException if category with name already exists', async () => {
      const createCategoryDto: CreateCategoryDto = { name: mockCategories[0].name };

      await expect(categoriesService.create(createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories: Category[] = await categoriesService.findAll();

      expect(categories).toEqual(mockCategories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category: Category = await categoriesService.findOne(mockCategories[0].id);

      expect(category).toEqual(mockCategories[0]);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(categoriesService.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = { name: 'Baz' };

    it('should update a category by id', async () => {
      const category: Category = await categoriesService.update(mockCategories[0].id, updateCategoryDto);

      expect(category).toEqual({ ...mockCategories[0], ...updateCategoryDto });
    });

    it('should throw a ConflictException if category with name already exists', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: mockCategories[0].name };

      await expect(categoriesService.update(mockCategories[0].id, updateCategoryDto)).rejects.toThrow(ConflictException);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(categoriesService.update('1', updateCategoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a game by id', async () => {
      const category: Category = await categoriesService.remove(mockCategories[0].id);

      expect(category).toEqual(mockCategories[0]);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(categoriesService.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
