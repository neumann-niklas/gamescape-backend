import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import supertest, { Response } from "supertest";
import { App } from "supertest/types";
import { mockUsers } from "./mocks/user.mock";

describe('UsersController (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const mockUsersService: Partial<UsersService> = {
            findAll: jest.fn().mockResolvedValue(mockUsers),
            findOne: jest.fn().mockImplementation((id: string) => {
                const user: User | null = mockUsers.find((user: User) => user.id === id) || null;
                if (!user) return { status: 404 } as Response;
                return Promise.resolve(user);
            }),
            update: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), ...updateUserDto })),
            updateEmail: jest.fn().mockImplementation((id: string, email: string) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), email: email })),
            updatePassword: jest.fn().mockImplementation((id: string, password: string) => Promise.resolve({ ...mockUsers.find((user: User) => user.id === id), password: password })),
            remove: jest.fn().mockImplementation((id: string) => Promise.resolve(mockUsers.find((user: User) => user.id === id)))
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [UsersController],
            providers: [{ provide: UsersService, useValue: mockUsersService }]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /', () => {
        it('should return an array of users', async () => {
            const response: Response = await supertest(app.getHttpServer()).get('/');

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(mockUsers);
        });
    });

    describe('GET /:id', () => {
        it('should return an user by id', async () => {
            const response: Response = await supertest(app.getHttpServer()).get('/' + mockUsers[0].id);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(mockUsers[0]);
        });
    });

    describe('PATCH /:id', () => {
        it('should update an user by id', async () => {
            const updateUserDto: UpdateUserDto = { firstName: 'James' };

            const response: Response = await supertest(app.getHttpServer()).patch('/' + mockUsers[0].id).send(updateUserDto);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({ ...mockUsers[0], ...updateUserDto });
        });
    });

    describe('PATCH /:id/email', () => {
        it('should update an user email by id', async () => {
            const email: string = 'james.doe@gamescape.de';

            const response: Response = await supertest(app.getHttpServer()).patch('/' + mockUsers[0].id + '/email').send(email);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({ ...mockUsers[0], email: email });
        });
    });

    describe('PATCH /:id/password', () => {
        it('should update an user password by id', async () => {
            const password: string = 'newPassword';

            const response: Response = await supertest(app.getHttpServer()).patch('/' + mockUsers[0].id + '/password').send(password);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({ ...mockUsers[0], password: password });
        });
    });

    describe('DELETE /:id', () => {
        it('should remove an user by id', async () => {
            const response: Response = await supertest(app.getHttpServer()).delete('/' + mockUsers[0].id);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(mockUsers[0]);
        });
    });
});
