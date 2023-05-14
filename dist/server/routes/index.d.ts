import { Express, Request, Response, NextFunction } from 'express';
declare module 'express-session' {
    interface SessionData {
        type?: string;
        host?: string;
        hostname?: string;
        port?: string | number;
        username?: string;
        password?: string;
        database?: string;
        database_name?: string;
        service_name?: string;
        synchronize?: boolean;
        logging?: boolean;
        db_type?: string;
        file_path?: string;
    }
}
declare const routes: (app: Express) => Promise<void>;
export declare const cookieSession: (req: Request, _res: Response, next: NextFunction) => void;
export default routes;
//# sourceMappingURL=index.d.ts.map