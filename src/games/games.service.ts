import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryGameDto } from './dto/query-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>) { }

  async create(authorId: string, createGameDto: CreateGameDto): Promise<Game> {
    if (await this.gamesRepository.existsBy({ title: createGameDto.title })) throw new ConflictException('Game with this title already exists!');

    return await this.gamesRepository.save(this.gamesRepository.create({ ...createGameDto, author: { id: authorId } }));
  }

  async findAll(queryGameDto?: QueryGameDto): Promise<Game[]> {
    const query: SelectQueryBuilder<Game> = this.gamesRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.author', 'author')
      .leftJoinAndSelect('game.category', 'category');

    if (queryGameDto?.search) query.andWhere('(LOWER(game.title) LIKE LOWER(:search))', { search: `%${queryGameDto.search}%` });
    if (queryGameDto?.groupPhase) query.andWhere('game.groupPhase = :groupPhase', { groupPhase: queryGameDto.groupPhase });
    if (queryGameDto?.categoryId) query.andWhere('category.id = :categoryId', { categoryId: queryGameDto.categoryId });
    if (queryGameDto?.sortBy) query.orderBy(`game.${queryGameDto.sortBy}`, queryGameDto.sortOrder || 'ASC');

    return await query.getMany();
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
