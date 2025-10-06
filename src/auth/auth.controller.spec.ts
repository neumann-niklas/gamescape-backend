import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

const mockAccessToken: string = 'accessToken';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService: Partial<AuthService> = {
      signUp: jest.fn().mockResolvedValue(mockAccessToken),
      logIn: jest.fn().mockResolvedValue(mockAccessToken)
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
      const signUpDto: SignUpDto = { email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: 'password' };

      const accessToken: string = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(accessToken).toEqual(mockAccessToken);
    });
  });

  describe('logIn', () => {
    it('should log in an existing user', async () => {
      const logInDto: LogInDto = { email: 'john.doe@gamescape.de', password: 'password' };

      const accessToken: string = await authController.logIn(logInDto);

      expect(authService.logIn).toHaveBeenCalledWith(logInDto);
      expect(accessToken).toEqual(mockAccessToken);
    });
  });
});
