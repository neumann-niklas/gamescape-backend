import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>) { }

  async create(authorId: string, createGameDto: CreateGameDto): Promise<Game> {
    if (await this.gamesRepository.existsBy({ title: createGameDto.title })) throw new ConflictException('Game with this title already exists!');

    return await this.gamesRepository.save(this.gamesRepository.create({ ...createGameDto, author: { id: authorId } }));
  }

  async findAll(): Promise<Game[]> {
    return await this.gamesRepository.find({ relations: { author: true, category: true } });
  }

  async findOne(id: string): Promise<Game> {
    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id }, relations: { author: true, category: true } });

    if (!game) throw new NotFoundException();

    return game;
  }

  async update(authorId: string, id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    if (updateGameDto.title) if (await this.gamesRepository.existsBy({ title: updateGameDto.title })) throw new ConflictException('Game with this title already exists!');

    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id }, relations: { author: true, category: true } });

    if (!game) throw new NotFoundException();
    if (game.author.id !== authorId) throw new ForbiddenException();

    return plainToInstance(Game, await this.gamesRepository.save({ ...game, ...updateGameDto }));
  }

  async remove(authorId: string, id: string): Promise<Game> {
    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id }, relations: { author: true } });

    if (!game) throw new NotFoundException();
    if (game.author.id !== authorId) throw new ForbiddenException();

    return await this.gamesRepository.remove(game);
  }
}
