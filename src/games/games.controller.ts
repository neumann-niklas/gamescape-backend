import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return await this.gamesService.create(createGameDto);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return await this.gamesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Game> {
    return await this.gamesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Promise<Game> {
    return await this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Game> {
    return await this.gamesService.remove(id);
  }
}
