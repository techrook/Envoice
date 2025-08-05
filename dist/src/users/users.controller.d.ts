interface AuthUser {
    id: string;
    username: string;
    email: string;
}
export declare class UsersController {
    constructor();
    getMe(user: AuthUser): {
        message: string;
        data: AuthUser;
    };
}
export {};
