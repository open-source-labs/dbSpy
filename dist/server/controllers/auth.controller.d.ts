import { RequestHandler } from 'express';
declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}
export declare const handleGoogleAuth: RequestHandler;
export declare const getGoogleAuthUrl: RequestHandler;
//# sourceMappingURL=auth.controller.d.ts.map