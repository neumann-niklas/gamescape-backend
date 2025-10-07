import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { mockUsers } from 'test/mocks/user.mock';
import { Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserEmailDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password: string) => Promise.resolve(password)),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const mockUsersRepository: Partial<Repository<User>> = {
      create: jest.fn().mockImplementation((signUpDto: SignUpDto) => { return { id: '0', ...signUpDto } }),
      save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
      remove: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
      existsBy: jest.fn().mockImplementation(({ email }) => Promise.resolve(mockUsers.some((user: User) => user.email === email))),
      find: jest.fn().mockResolvedValue(mockUsers),
      findOne: jest.fn().mockImplementation(({ where: { id, email } }) => Promise.resolve(mockUsers.find((user: User) => user.id === id || user.email === email) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: mockUsersRepository }]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: 'password' };

      const user: User = await usersService.create(signUpDto);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: signUpDto.email });
      expect(usersRepository.create).toHaveBeenCalledWith(signUpDto);
      expect(usersRepository.save).toHaveBeenCalledWith({ id: '0', ...signUpDto });
      expect(user).toEqual({ id: '0', ...signUpDto });
    });

    it('should throw a ConflictException when an user with this email already exists', async () => {
      await expect(usersService.create(mockUsers[0])).rejects.toThrow(ConflictException);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: mockUsers[0].email });
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = await usersService.findAll();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return an user by id', async () => {
      const user: User = await usersService.findOne(mockUsers[0].id);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(user).toEqual(mockUsers[0]);
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.findOne('2')).rejects.toThrow(NotFoundException);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
    });
  });

  describe('findOneByEmail', () => {
    it('should return an user by email', async () => {
      const user: User = await usersService.findOneByEmail(mockUsers[0].email);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: mockUsers[0].email } });
      expect(user).toEqual(mockUsers[0]);
    });

    it('should throw a NotFoundException if an user is not found by email', async () => {
      await expect(usersService.findOneByEmail('james.doe@gamescape.de')).rejects.toThrow(NotFoundException);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'james.doe@gamescape.de' } });
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = { firstName: 'James' };

    it('should update an user by id', async () => {
      const user: User = await usersService.update(mockUsers[0].id, updateUserDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.save).toHaveBeenCalledWith(plainToInstance(User, { ...mockUsers[0], ...updateUserDto }));
      expect(user).toEqual(plainToInstance(User, { ...mockUsers[0], ...updateUserDto }));
    });

    it('should throw a ConflictException if the update body is empty', async () => {
      await expect(usersService.update(mockUsers[0].id, {})).rejects.toThrow(ConflictException);

      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.update('2', updateUserDto)).rejects.toThrow(NotFoundException);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateEmail', () => {
    const updateUserEmailDto: UpdateUserEmailDto = { email: 'james.doe@gamescape.de' };

    it('should update an user email by id', async () => {
      const user: User = await usersService.updateEmail(mockUsers[0].id, updateUserEmailDto);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: updateUserEmailDto.email });
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.save).toHaveBeenCalledWith(plainToInstance(User, { ...mockUsers[0], ...updateUserEmailDto }));
      expect(user).toEqual(plainToInstance(User, { ...mockUsers[0], ...updateUserEmailDto }));
    });

    it('should throw a ConflictException when an user with this email already exists', async () => {
      await expect(usersService.updateEmail(mockUsers[0].id, { email: mockUsers[0].email })).rejects.toThrow(ConflictException);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: mockUsers[0].email });
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.updateEmail('2', updateUserEmailDto)).rejects.toThrow(NotFoundException);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: updateUserEmailDto.email });
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    const updateUserPasswordDto: UpdateUserPasswordDto = { password: 'newPassword' };

    it('should update an user password by id', async () => {
      const user: User = await usersService.updatePassword(mockUsers[0].id, updateUserPasswordDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.save).toHaveBeenCalledWith(plainToInstance(User, { ...mockUsers[0], ...updateUserPasswordDto }));
      expect(user).toEqual(plainToInstance(User, { ...mockUsers[0], ...updateUserPasswordDto }));
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.updatePassword('2', updateUserPasswordDto)).rejects.toThrow(NotFoundException);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an user by id', async () => {
      const user: User = await usersService.remove(mockUsers[0].id);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.remove).toHaveBeenCalledWith(mockUsers[0]);
      expect(user).toEqual(mockUsers[0]);
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.remove('2')).rejects.toThrow(NotFoundException);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.remove).not.toHaveBeenCalled();
    });
  });
});
