import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

const mockUsers: User[] = [
  { id: '0', email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: '1234' },
  { id: '1', email: 'jane.doe@gamescape.de', firstName: 'Jane', lastName: 'Doe', password: '1234' }
];

describe('AuthService', () => {
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const mockUsersService: Partial<UsersService> = {
      create: jest.fn().mockImplementation((signUpDto: SignUpDto) => Promise.resolve({ id: '2', ...signUpDto })),
      findOneByEmail: jest.fn().mockImplementation((email: string) => Promise.resolve(mockUsers.find(user => user.email === email)))
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UsersService, useValue: mockUsersService }, AuthService]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: '1234' };

      const user: User = await authService.signUp(signUpDto);

      expect(usersService.create).toHaveBeenCalledWith(signUpDto);
      expect(user).toEqual({ id: '2', ...signUpDto });
    });
  });

  describe('logIn', () => {
    it('should log in an existing user', async () => {
      const logInDto: LogInDto = { email: mockUsers[0].email, password: mockUsers[0].password! };

      const user: User = await authService.logIn(logInDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(logInDto.email);
      expect(user).toEqual(mockUsers[0]);
    });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      expect(authService.logIn({ email: mockUsers[0].email, password: '5678' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
