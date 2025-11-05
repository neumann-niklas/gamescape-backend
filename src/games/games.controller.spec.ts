import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockGames } from 'test/mocks/game.mock';
import { mockUsers } from 'test/mocks/user.mock';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: GamesService;

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {};
    const mockGamesService: Partial<GamesService> = {
      create: jest.fn().mockImplementation((authorId: string, createGameDto: CreateGameDto) => { return { id: '0', ...createGameDto, author: { id: authorId } } }),
      findAll: jest.fn().mockResolvedValue(mockGames),
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockGames.find((game: Game) => game.id === id) || null)),
      update: jest.fn().mockImplementation((_, id: string, updateGameDto: UpdateGameDto) => Promise.resolve({ ...mockGames.find((game: Game) => game.id === id), ...updateGameDto })),
      remove: jest.fn().mockImplementation((_, id: string) => Promise.resolve(mockGames.find((game: Game) => game.id === id) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: GamesService, useValue: mockGamesService }
      ]
    }).compile();

    gamesController = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const createGameDto: CreateGameDto = { title: 'Foo' };

      const game: Game = await gamesController.create(mockUsers[0].id, createGameDto);

      expect(gamesService.create).toHaveBeenCalledWith(mockUsers[0].id, createGameDto);
      expect(game).toEqual({ id: '0', ...createGameDto, author: { id: mockUsers[0].id } });
    });
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      const games: Game[] = await gamesController.findAll({});

      expect(gamesService.findAll).toHaveBeenCalled();
      expect(games).toEqual(mockGames);
    });
  });

  describe('findOne', () => {
    it('should return a game by id', async () => {
      const game: Game = await gamesController.findOne(mockGames[0].id);

      expect(gamesService.findOne).toHaveBeenCalledWith(mockGames[0].id);
      expect(game).toEqual(mockGames[0]);
    });
  });

  describe('update', () => {
    it('should update a game by id', async () => {
      const updateGameDto: UpdateGameDto = { title: 'Foo' };

      const game: Game = await gamesController.update(mockUsers[0].id, mockGames[0].id, updateGameDto);

      expect(gamesService.update).toHaveBeenCalledWith(mockUsers[0].id, mockGames[0].id, updateGameDto);
      expect(game).toEqual({ ...mockGames[0], ...updateGameDto });
    });
  });

  describe('remove', () => {
    it('should remove a game by id', async () => {
      const game: Game = await gamesController.remove(mockUsers[0].id, mockGames[0].id);

      expect(gamesService.remove).toHaveBeenCalledWith(mockUsers[0].id, mockGames[0].id);
      expect(game).toEqual(mockGames[0]);
    });
  });
});
