import { Test, TestingModule } from '@nestjs/testing';
import { mockUsers } from 'test/mocks/user.mock';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      findAll: jest.fn().mockResolvedValue(mockUsers),
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = await usersController.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return an user by id', async () => {
      const user: User = await usersController.findOne(mockUsers[0].id);

      expect(usersService.findOne).toHaveBeenCalledWith(mockUsers[0].id);
      expect(user).toEqual(mockUsers[0]);
    });
  });
});
