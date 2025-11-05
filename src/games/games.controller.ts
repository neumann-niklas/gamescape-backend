import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryGameDto } from './dto/query-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post()
  async create(@UserId() authorId: string, @Body() createGameDto: CreateGameDto): Promise<Game> {
    return await this.gamesService.create(authorId, createGameDto);
  }

  @Public()
  @Get()
  async findAll(@Query() queryGameDto: QueryGameDto): Promise<Game[]> {
    return await this.gamesService.findAll(queryGameDto);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Game> {
    return await this.gamesService.findOne(id);
  }

  @Patch(':id')
  async update(@UserId() authorId: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateGameDto: UpdateGameDto): Promise<Game> {
    return await this.gamesService.update(authorId, id, updateGameDto);
  }

  @Delete(':id')
  async remove(@UserId() authorId: string, @Param('id', ParseUUIDPipe) id: string): Promise<Game> {
    return await this.gamesService.remove(authorId, id);
  }
}
