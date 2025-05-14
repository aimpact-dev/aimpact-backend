import { UserService } from './user.service';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    findByIdPublic(id: string): Promise<import("../../entities/user.entity").User | null>;
    findByIdAuth(id: string): Promise<import("../../entities/user.entity").User | null>;
}
