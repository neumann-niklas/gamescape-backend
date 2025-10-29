import { Game } from "src/games/entities/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly name: string;

    @OneToMany(() => Game, (game: Game) => game.category)
    readonly games: Game[];
}
