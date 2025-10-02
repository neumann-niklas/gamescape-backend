import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

const mockAccessToken: string = 'accessToken';
const mockUser: User = { id: '0', email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: '1234' }

describe('AuthService', () => {
  let jwtService: JwtService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const mockJwtService: Partial<JwtService> = {
      signAsync: jest.fn().mockResolvedValue(mockAccessToken)
    };
    const mockUsersService: Partial<UsersService> = {
      create: jest.fn().mockImplementation((signUpDto: SignUpDto) => Promise.resolve({ id: '1', ...signUpDto })),
      findOneByEmail: jest.fn().mockResolvedValue(mockUser)
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
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: '1234' };

      const accessToken: string = await authService.signUp(signUpDto);

      expect(usersService.create).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(accessToken).toEqual(mockAccessToken);
    });
  });

  describe('logIn', () => {
    // TODO: Fix test with bcrypt mock
    // it('should log in an existing user', async () => {
    //   const logInDto: LogInDto = { email: mockUser.email, password: mockUser.password };

    //   const accessToken: string = await authService.logIn(logInDto);

    //   expect(usersService.findOneByEmail).toHaveBeenCalledWith(logInDto.email);
    //   expect(accessToken).toEqual(mockAccessToken);
    // });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      expect(authService.logIn({ email: mockUser.email, password: '5678' })).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
