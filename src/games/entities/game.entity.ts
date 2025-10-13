import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupPhase } from "../enums/group-phase.enum";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    readonly title: string;

    @Column('enum', { name: 'group_phase', enum: GroupPhase, default: GroupPhase.Forming })
    readonly groupPhase: GroupPhase;

    @ManyToOne(() => User, (user: User) => user.games)
    @JoinColumn({ name: 'author_id' })
    readonly author: User;

    @CreateDateColumn({ name: 'create_date' })
    readonly createDate: Date;

    @CreateDateColumn({ name: 'update_date' })
    readonly updateDate: Date;
}
