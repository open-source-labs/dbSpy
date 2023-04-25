import { Express } from 'express';
declare module 'express-session' {
    interface SessionData {
        user: string;
    }
}
declare const routes: (app: Express) => Promise<void>;
export default routes;
//# sourceMappingURL=index.d.ts.map