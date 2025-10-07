import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEmailDto, UpdatePasswordDto, UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { mockUsers } from 'test/mocks/user.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

const mockAccessToken: string = 'accessToken';

describe('AuthController', () => {
  let usersService: UsersService;
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockJwtService: Partial<JwtService> = {};
    const mockUsersService: Partial<UsersService> = {
      findOne: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id) || null)),
      update: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserDto })),
      updateEmail: jest.fn().mockImplementation((id: string, updateEmailDto: UpdateEmailDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateEmailDto })),
      updatePassword: jest.fn().mockImplementation((id: string, updatePasswordDto: UpdatePasswordDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updatePasswordDto })),
      remove: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id)))
    };
    const mockAuthService: Partial<AuthService> = {
      signUp: jest.fn().mockResolvedValue({ accessToken: mockAccessToken }),
      logIn: jest.fn().mockResolvedValue({ accessToken: mockAccessToken })
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const signUpDto: SignUpDto = { email: 'john.doe@gamescape.de', firstName: 'John', lastName: 'Doe', password: 'password' };

      const { accessToken }: { readonly accessToken: string } = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(accessToken).toEqual(mockAccessToken);
    });
  });

  describe('logIn', () => {
    it('should log in an existing user', async () => {
      const logInDto: LogInDto = { email: 'john.doe@gamescape.de', password: 'password' };

      const { accessToken }: { readonly accessToken: string } = await authController.logIn(logInDto);

      expect(authService.logIn).toHaveBeenCalledWith(logInDto);
      expect(accessToken).toEqual(mockAccessToken);
    });
  });

  describe('getUser', () => {
    it('should get the authenticated user', async () => {
      const user: User = await authController.getUser({ payload: { sub: mockUsers[0].id } });

      expect(usersService.findOne).toHaveBeenCalledWith(mockUsers[0].id);
      expect(user).toEqual(mockUsers[0])
    });
  });

  describe('update', () => {
    it('should update an user by id', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'James' };

      const user: User = await authController.update({ payload: { sub: mockUsers[0].id } }, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(mockUsers[0].id, updateUserDto);
      expect(user).toEqual({ ...mockUsers[0], ...updateUserDto });
    });
  });

  describe('updateEmail', () => {
    it('should update an user email by id', async () => {
      const updateEmailDto: UpdateEmailDto = { email: 'james.doe@gamescape.de' };

      const user: User = await authController.updateEmail({ payload: { sub: mockUsers[0].id } }, updateEmailDto);

      expect(usersService.updateEmail).toHaveBeenCalledWith(mockUsers[0].id, updateEmailDto);
      expect(user).toEqual({ ...mockUsers[0], ...updateEmailDto });
    });
  });

  describe('updatePassword', () => {
    it('should update an user password by id', async () => {
      const updatePasswordDto: UpdatePasswordDto = { password: 'newPassword' };

      const user: User = await authController.updatePassword({ payload: { sub: mockUsers[0].id } }, updatePasswordDto);

      expect(usersService.updatePassword).toHaveBeenCalledWith(mockUsers[0].id, updatePasswordDto);
      expect(user).toEqual({ ...mockUsers[0], ...updatePasswordDto });
    });
  });

  describe('remove', () => {
    it('should remove an user by id', async () => {
      const user: User = await authController.remove({ payload: { sub: mockUsers[0].id } });

      expect(usersService.remove).toHaveBeenCalledWith(mockUsers[0].id);
      expect(user).toEqual(mockUsers[0]);
    });
  });
});
