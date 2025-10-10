import { Game } from "src/games/entities/game.entity";
import { mockUsers } from "./user.mock";

export const mockGames: Game[] = [
    { id: '00000000-0000-0000-0000-000000000000', title: 'Foo', author: mockUsers[0] },
    { id: '00000000-0000-0000-0000-000000000001', title: 'Bar', author: mockUsers[0] }
];
