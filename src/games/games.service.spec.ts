import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockGames } from 'test/mocks/game.mock';
import { mockUsers } from 'test/mocks/user.mock';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

describe('GamesService', () => {
  let gamesService: GamesService;
  let gamesRepository: Repository<Game>;

  beforeEach(async () => {
    const createQueryBuilderMock = () => {
      const selectQueryBuilder: Partial<SelectQueryBuilder<Game>> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(mockGames)
      };

      return selectQueryBuilder;
    };

    const mockGamesRepository: Partial<Repository<Game>> = {
      createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock()),
      create: jest.fn().mockImplementation((createGameDto: CreateGameDto) => { return { id: '0', ...createGameDto } }),
      save: jest.fn().mockImplementation((game: Game) => Promise.resolve(game)),
      remove: jest.fn().mockImplementation((game: Game) => Promise.resolve(game)),
      existsBy: jest.fn().mockImplementation(({ title }) => Promise.resolve(mockGames.some((game: Game) => game.title === title))),
      findOne: jest.fn().mockImplementation(({ where: { id: id } }) => Promise.resolve(mockGames.find((game: Game) => game.id === id) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, { provide: getRepositoryToken(Game), useValue: mockGamesRepository }]
    }).compile();

    gamesService = module.get<GamesService>(GamesService);
    gamesRepository = module.get<Repository<Game>>(getRepositoryToken(Game));

    (gamesRepository as any).queryBuilder = createQueryBuilderMock();
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const createGameDto: CreateGameDto = { title: 'Baz' };

      const game: Game = await gamesService.create(mockUsers[0].id, createGameDto);

      expect(game).toEqual({ id: '0', ...createGameDto, author: { id: mockUsers[0].id } });
    });

    it('should throw a ConflictException if game with title already exists', async () => {
      const createGameDto: CreateGameDto = { title: mockGames[0].title };

      await expect(gamesService.create(mockUsers[0].id, createGameDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      const games: Game[] = await gamesService.findAll({});

      expect(games).toEqual(mockGames);
    });
  });

  describe('findOne', () => {
    it('should return a game by id', async () => {
      const game: Game = await gamesService.findOne(mockGames[0].id);

      expect(game).toEqual(mockGames[0]);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(gamesService.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateGameDto: UpdateGameDto = { title: 'Quux' };

    it('should update a game by id', async () => {
      const game: Game = await gamesService.update(mockUsers[0].id, mockGames[0].id, updateGameDto);

      expect(game).toEqual({ ...mockGames[0], ...updateGameDto });
    });

    it('should throw a ConflictException if game with title already exists', async () => {
      const updateGameDto: UpdateGameDto = { title: mockGames[0].title };

      await expect(gamesService.update(mockUsers[0].id, mockGames[0].id, updateGameDto)).rejects.toThrow(ConflictException);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(gamesService.update(mockUsers[0].id, '1', updateGameDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a game by id', async () => {
      const game: Game = await gamesService.remove(mockUsers[0].id, mockGames[0].id);

      expect(game).toEqual(mockGames[0]);
    });

    it('should throw a NotFoundException if no game is found', async () => {
      await expect(gamesService.remove(mockUsers[0].id, '1')).rejects.toThrow(NotFoundException);
    });
  });
});
