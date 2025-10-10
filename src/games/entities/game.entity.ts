import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly title: string;
}
