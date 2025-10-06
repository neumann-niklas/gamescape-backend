import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { mockUsers } from 'test/mocks/user.mock';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password: string) => Promise.resolve(password)),
  genSalt: jest.fn().mockResolvedValue('salt'),
  compare: jest.fn().mockImplementation((data: string, encrypted: string) => Promise.resolve(data === encrypted))
}));

const mockAccessToken: string = 'accessToken';

describe('AuthService', () => {
  let jwtService: JwtService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {
      signAsync: jest.fn().mockResolvedValue(mockAccessToken)
    };
    const mockUsersService: Partial<UsersService> = {
      create: jest.fn().mockImplementation((signUpDto: SignUpDto) => Promise.resolve({ id: '0', ...signUpDto })),
      findOneByEmail: jest.fn().mockImplementation((email: string) => Promise.resolve(mockUsers.find((user: User) => user.email === email) || null))
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
        AuthService
      ]
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: 'password' };

      const accessToken: string = await authService.signUp(signUpDto);

      expect(usersService.create).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(accessToken).toEqual(mockAccessToken);
    });
  });

  describe('logIn', () => {
    it('should log in an existing user', async () => {
      const logInDto: LogInDto = { email: mockUsers[0].email, password: mockUsers[0].password };

      const accessToken: string = await authService.logIn(logInDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(logInDto.email);
      expect(accessToken).toEqual(mockAccessToken);
    });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      expect(authService.logIn({ email: mockUsers[0].email, password: 'invalidPassword' })).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(mockUsers[0].email);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
