import { Test, TestingModule } from '@nestjs/testing';
import { mockCategories } from 'test/mocks/category.mock';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const mockCategoriesService: Partial<CategoriesService> = {
      create: jest.fn().mockImplementation((createCategoryDto: CreateCategoryDto) => Promise.resolve({ id: mockCategories[0].id, ...createCategoryDto, games: [] })),
      findAll: jest.fn().mockResolvedValue(mockCategories),
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockCategories.find((category: Category) => category.id === id) || null)),
      update: jest.fn().mockImplementation((id: string, updateCategoryDto: UpdateCategoryDto) => Promise.resolve({ ...mockCategories.find((category: Category) => category.id === id), ...updateCategoryDto })),
      remove: jest.fn().mockImplementation((id: string) => Promise.resolve(mockCategories.find((category: Category) => category.id === id) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }]
    }).compile();

    categoriesController = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Foo' };

      const category: Category = await categoriesController.create(createCategoryDto);

      expect(category).toEqual(mockCategories[0]);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories: Category[] = await categoriesController.findAll();

      expect(categories).toEqual(mockCategories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category: Category = await categoriesController.findOne(mockCategories[0].id);

      expect(category).toEqual(mockCategories[0]);
    });
  });

  describe('update', () => {
    it('should update a category by id', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Baz' };

      const category: Category = await categoriesController.update(mockCategories[0].id, updateCategoryDto);

      expect(category).toEqual({ ...mockCategories[0], ...updateCategoryDto });
    });
  });

  describe('remove', () => {
    it('should remove a game by id', async () => {
      const category: Category = await categoriesController.remove(mockCategories[0].id);

      expect(category).toEqual(mockCategories[0]);
    });
  });
});
