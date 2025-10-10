import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly title: string;

    @ManyToOne(() => User, (user: User) => user.games)
    @JoinColumn({ name: 'author_id' })
    readonly author: User;
}
