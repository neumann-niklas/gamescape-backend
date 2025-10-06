import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserEmailDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async create(signUpDto: SignUpDto): Promise<User> {
        if (await this.usersRepository.existsBy({ email: signUpDto.email })) throw new ConflictException('User with this email already exists!');

        return await this.usersRepository.save(this.usersRepository.create(signUpDto));
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { email: email } });

        if (!user) throw new NotFoundException('User not found!');

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.save({ ...user, ...updateUserDto });
    }

    async updateEmail(id: string, updateUserEmailDto: UpdateUserEmailDto): Promise<User> {
        if (await this.usersRepository.existsBy({ email: updateUserEmailDto.email })) throw new ConflictException('User with this email already exists!');

        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.save({ ...user, ...updateUserEmailDto });
    }

    async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.save({ ...user, password: await hash(updateUserPasswordDto.password, await genSalt()) });
    }

    async remove(id: string): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.remove(user);
    }
}
