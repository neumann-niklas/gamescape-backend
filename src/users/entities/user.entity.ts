import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
