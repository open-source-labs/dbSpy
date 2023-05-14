import { Request, Response, NextFunction } from 'express';
declare const microsoftController: {
    microsoftQuery: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftAddNewRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftUpdateRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftDeleteRow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftAddNewColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftUpdateColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftDeleteColumn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftAddNewTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftGetTableNames: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftDeleteTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftAddForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    microsoftRemoveForeignKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default microsoftController;
//# sourceMappingURL=microsoftData.controller.d.ts.map