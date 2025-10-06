import { Test, TestingModule } from '@nestjs/testing';
import { mockUsers } from 'test/mocks/user.mock';
import { UpdateUserDto, UpdateUserEmailDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      findAll: jest.fn().mockResolvedValue(mockUsers),
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id) || null)),
      update: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserDto })),
      updateEmail: jest.fn().mockImplementation((id: string, updateUserEmailDto: UpdateUserEmailDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserEmailDto })),
      updatePassword: jest.fn().mockImplementation((id: string, updateUserPasswordDto: UpdateUserPasswordDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserPasswordDto })),
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
      const updateUserEmailDto: UpdateUserEmailDto = { email: 'james.doe@gamescape.de' };

      const user: User = await usersController.updateEmail(mockUsers[0].id, updateUserEmailDto);

      expect(usersService.updateEmail).toHaveBeenCalledWith(mockUsers[0].id, updateUserEmailDto);
      expect(user).toEqual({ ...mockUsers[0], ...updateUserEmailDto });
    });
  });

  describe('updatePassword', () => {
    it('should update an user password by id', async () => {
      const updateUserPasswordDto: UpdateUserPasswordDto = { password: 'newPassword' };

      const user: User = await usersController.updatePassword(mockUsers[0].id, updateUserPasswordDto);

      expect(usersService.updatePassword).toHaveBeenCalledWith(mockUsers[0].id, updateUserPasswordDto);
      expect(user).toEqual({ ...mockUsers[0], ...updateUserPasswordDto });
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
