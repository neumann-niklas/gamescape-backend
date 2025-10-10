import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>) { }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    if (await this.gamesRepository.existsBy({ title: createGameDto.title })) throw new ConflictException('Game with this title already exists!');

    return await this.gamesRepository.save(this.gamesRepository.create(createGameDto));
  }

  async findAll(): Promise<Game[]> {
    return await this.gamesRepository.find();
  }

  async findOne(id: string): Promise<Game> {
    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id } });

    if (!game) throw new NotFoundException();

    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    if (await this.gamesRepository.existsBy({ title: updateGameDto.title })) throw new ConflictException('Game with this title already exists!');

    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id } });

    if (!game) throw new NotFoundException();

    return await this.gamesRepository.save({ ...game, ...updateGameDto });
  }

  async remove(id: string): Promise<Game> {
    const game: Game | null = await this.gamesRepository.findOne({ where: { id: id } });

    if (!game) throw new NotFoundException();

    return await this.gamesRepository.remove(game);
  }
}
