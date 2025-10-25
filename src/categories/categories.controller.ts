import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(AuthorizationGuard)
  @Authorization(Role.Admin)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @UseGuards(AuthorizationGuard)
  @Authorization(Role.Admin)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthorizationGuard)
  @Authorization(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return await this.categoriesService.remove(id);
  }
}
