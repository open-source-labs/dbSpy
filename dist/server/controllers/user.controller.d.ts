import { RequestHandler } from 'express';
import { RowDataPacket } from 'mysql2';
export declare const findUser: (email: string) => Promise<[RowDataPacket[] | RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket")[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader"), import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket")[]]>;
export declare const createUser: (user: string[]) => Promise<void>;
export declare const userRegistration: RequestHandler;
export declare const verifyUser: RequestHandler;
export declare const saveSchema: RequestHandler;
export declare const retrieveSchema: RequestHandler;
//# sourceMappingURL=user.controller.d.ts.map