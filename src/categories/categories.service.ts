import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (await this.categoriesRepository.existsBy({ name: createCategoryDto.name })) throw new ConflictException('Category with this name already exists!');

    return await this.categoriesRepository.save(this.categoriesRepository.create(createCategoryDto));
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category: Category | null = await this.categoriesRepository.findOne({ where: { id: id } });

    if (!category) throw new NotFoundException();

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    if (updateCategoryDto.name) if (await this.categoriesRepository.existsBy({ name: updateCategoryDto.name })) throw new ConflictException('Category with this name already exists!');

    const category: Category | null = await this.categoriesRepository.findOne({ where: { id: id } });

    if (!category) throw new NotFoundException();

    return plainToInstance(Category, await this.categoriesRepository.save({ ...category, ...updateCategoryDto }));
  }

  async remove(id: string): Promise<Category> {
    const category: Category | null = await this.categoriesRepository.findOne({ where: { id: id } });

    if (!category) throw new NotFoundException();

    return await this.categoriesRepository.remove(category);
  }
}
