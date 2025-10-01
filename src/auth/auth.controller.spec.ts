import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

const mockUsers: User[] = [
  { id: '0', email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: '1234' },
  { id: '1', email: 'jane.doe@gamescape.de', firstName: 'Jane', lastName: 'Doe', password: '1234' }
];

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService: Partial<AuthService> = {
      signUp: jest.fn().mockImplementation((signUpDto: SignUpDto) => Promise.resolve({ id: '2', ...signUpDto })),
      logIn: jest.fn().mockImplementation((logInDto: LogInDto) => Promise.resolve(mockUsers.find((user: User) => user.email === logInDto.email)))
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const signUpDto: SignUpDto = { email: 'james.doe@gamescape.de', firstName: 'James', lastName: 'Doe', password: '1234' };

      const user: User = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(user).toEqual({ id: '2', ...signUpDto });
    });
  });

  describe('logIn', () => {
    it('should log in an existing user', async () => {
      const logInDto: LogInDto = { email: mockUsers[0].email, password: mockUsers[0].password! };

      const user: User = await authController.logIn(logInDto);

      expect(authService.logIn).toHaveBeenCalledWith(logInDto);
      expect(user).toEqual(mockUsers[0]);
    });
  });
});
