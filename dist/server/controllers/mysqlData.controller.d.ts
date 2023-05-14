import { Request, Response, NextFunction } from 'express';
declare const mysqlController: {
    mysqlQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlAddNewRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlUpdateRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlDeleteRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlAddNewColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlUpdateColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlDeleteColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlAddNewTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlGetTableNames: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlDeleteTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlAddForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    mysqlRemoveForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default mysqlController;
//# sourceMappingURL=mysqlData.controller.d.ts.map