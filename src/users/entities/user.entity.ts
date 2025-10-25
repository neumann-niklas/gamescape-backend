import { Exclude } from "class-transformer";
import { Role } from "src/auth/enums/role.enum";
import { Game } from "src/games/entities/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly email: string;

    @Column({ name: 'first_name' })
    readonly firstName: string;

    @Column({ name: 'last_name' })
    readonly lastName: string;

    @Exclude()
    @Column()
    readonly password: string;

    @Column('enum', { enum: Role, default: Role.User })
    readonly role: Role;

    @OneToMany(() => Game, (game: Game) => game.author)
    readonly games: Game[];
}
