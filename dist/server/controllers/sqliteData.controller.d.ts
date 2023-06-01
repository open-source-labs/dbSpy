import { Request, Response, NextFunction } from 'express';
declare const sqliteController: {
    sqliteQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteAddNewRow: (req: Request, _res: Response, next: NextFunction) => Promise<unknown>;
    sqliteUpdateRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteDeleteRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteAddNewColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteUpdateColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteDeleteColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteAddNewTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteGetTableNames: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteDeleteTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteAddForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sqliteRemoveForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default sqliteController;
//# sourceMappingURL=sqliteData.controller.d.ts.map