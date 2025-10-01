import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUsers: User[] = [
  { id: '0', email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe' },
  { id: '1', email: 'jane.doe@gamescape.de', firstName: 'Jane', lastName: 'Doe' }
];

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const mockUsersRepository = {
      create: jest.fn().mockImplementation((signUpDto: SignUpDto) => { return { id: '2', ...signUpDto } }),
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

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: '1234' };

      const user: User = await usersService.create(signUpDto);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: signUpDto.email });
      expect(usersRepository.create).toHaveBeenCalledWith(signUpDto);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(user).toEqual({ id: '2', ...signUpDto });
    });

    it('should throw a ConflictException when an user with this email already exists', async () => {
      const signUpDto: SignUpDto = { ...mockUsers[0], password: '1234' };

      await expect(usersService.create(signUpDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: signUpDto.email });
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
      expect(usersRepository.save).toHaveBeenCalledWith({ ...mockUsers[0], ...updateUserDto });
      expect(user).toEqual({ ...mockUsers[0], ...updateUserDto });
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.update('2', updateUserDto)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateEmail', () => {
    const email: string = 'james.doe@gamescape.de';

    it('should update an user email by id', async () => {
      const user: User = await usersService.updateEmail(mockUsers[0].id, email);

      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: email });
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.save).toHaveBeenCalledWith({ ...mockUsers[0], email: email });
      expect(user).toEqual({ ...mockUsers[0], email: email });
    });

    it('should throw a ConflictException when an user with this email already exists', async () => {
      await expect(usersService.updateEmail(mockUsers[0].id, mockUsers[0].email)).rejects.toThrow(ConflictException);
      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: mockUsers[0].email });
      expect(usersRepository.findOne).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.updateEmail('2', email)).rejects.toThrow(NotFoundException);
      expect(usersRepository.existsBy).toHaveBeenCalledWith({ email: email });
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    const password: string = '1234';

    it('should update an user password by id', async () => {
      const user: User = await usersService.updatePassword(mockUsers[0].id, password);

      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUsers[0].id } });
      expect(usersRepository.save).toHaveBeenCalledWith({ ...mockUsers[0], password: password });
      expect(user).toEqual({ ...mockUsers[0], password: password });
    });

    it('should throw a NotFoundException if an user is not found by id', async () => {
      await expect(usersService.updatePassword('2', password)).rejects.toThrow(NotFoundException);
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
