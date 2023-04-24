import { RequestHandler } from 'express';
declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}
export declare const getCurrentUser: RequestHandler;
//# sourceMappingURL=session.service.d.ts.map