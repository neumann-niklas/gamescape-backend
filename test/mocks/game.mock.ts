import { Game } from "src/games/entities/game.entity";
import { GroupPhase } from "src/games/enums/group-phase.enum";
import { mockCategories } from "./category.mock";
import { mockUsers } from "./user.mock";

export const mockGames: Game[] = [
    { id: '00000000-0000-0000-0000-000000000000', title: 'Foo', groupPhase: GroupPhase.Forming, createDate: new Date(), updateDate: new Date(), author: mockUsers[0], category: mockCategories[0] },
    { id: '00000000-0000-0000-0000-000000000001', title: 'Bar', groupPhase: GroupPhase.Forming, createDate: new Date(), updateDate: new Date(), author: mockUsers[0], category: mockCategories[1] }
];
