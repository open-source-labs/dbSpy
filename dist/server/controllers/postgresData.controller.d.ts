import { Request, Response, NextFunction } from 'express';
declare const postgresController: {
    postgresQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresAddNewRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresUpdateRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresDeleteRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresAddNewColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresUpdateColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresDeleteColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresAddNewTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresGetTableNames: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresDeleteTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresAddForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    postgresRemoveForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default postgresController;
//# sourceMappingURL=postgresData.controller.d.ts.map