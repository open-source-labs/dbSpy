import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    full_name: string;
    sub: string;
    email: string;
    picture: string;
    pg_schema: string;
    password: string;
}
export declare class UserPost extends BaseEntity {
    id: number;
    user_name: string;
}
//# sourceMappingURL=user.entity.d.ts.map