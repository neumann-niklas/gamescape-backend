import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        if (await this.usersRepository.existsBy({ email: createUserDto.email })) throw new ConflictException('User with this email already exists!');

        return this.usersRepository.save(this.usersRepository.create(createUserDto));
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        if (await this.usersRepository.existsBy({ email: updateUserDto.email })) throw new ConflictException('User with this email already exists!');

        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.save({ ...user, ...updateUserDto });
    }

    async remove(id: string): Promise<User> {
        const user: User | null = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) throw new NotFoundException('User not found!');

        return await this.usersRepository.remove(user);
    }
}
