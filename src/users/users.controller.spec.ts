import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsers: User[] = [
  { id: '0', email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: '1234' },
  { id: '1', email: 'jane.doe@gamescape.de', firstName: 'Jane', lastName: 'Doe', password: '1234' }
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockUsersService: Partial<UsersService> = {
      findAll: jest.fn().mockResolvedValue(mockUsers),
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id) || null)),
      update: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserDto })),
      updateEmail: jest.fn().mockImplementation((id: string, email: string) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), email: email })),
      updatePassword: jest.fn().mockImplementation((id: string, password: string) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), password: password })),
      remove: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id)))
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
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

  describe('update', () => {
    it('should update an user by id', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'James' };

      const user: User = await usersController.update(mockUsers[0].id, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(mockUsers[0].id, updateUserDto);
      expect(user).toEqual({ ...mockUsers[0], ...updateUserDto });
    });
  });

  describe('updateEmail', () => {
    it('should update an user email by id', async () => {
      const email: string = 'james.doe@gamescape.de';

      const user: User = await usersController.updateEmail(mockUsers[0].id, email);

      expect(usersService.updateEmail).toHaveBeenCalledWith(mockUsers[0].id, email);
      expect(user).toEqual({ ...mockUsers[0], email: email });
    });
  });

  describe('updatePassword', () => {
    it('should update an user password by id', async () => {
      const password: string = '1234';

      const user: User = await usersController.updatePassword(mockUsers[0].id, password);

      expect(usersService.updatePassword).toHaveBeenCalledWith(mockUsers[0].id, password);
      expect(user).toEqual({ ...mockUsers[0], password: password });
    });
  });

  describe('remove', () => {
    it('should remove an user by id', async () => {
      const user: User = await usersController.remove(mockUsers[0].id);

      expect(usersService.remove).toHaveBeenCalledWith(mockUsers[0].id);
      expect(user).toEqual(mockUsers[0]);
    });
  });
});
