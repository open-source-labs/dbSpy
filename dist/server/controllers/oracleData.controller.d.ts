import { Request, Response, NextFunction } from 'express';
declare const oracleController: {
    oracleQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleAddNewRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleUpdateRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleDeleteRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleAddNewColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleUpdateColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleDeleteColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleAddNewTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleGetTableNames: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleDeleteTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleAddForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    oracleRemoveForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default oracleController;
//# sourceMappingURL=oracleData.controller.d.ts.map