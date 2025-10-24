import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly name: string;
}
