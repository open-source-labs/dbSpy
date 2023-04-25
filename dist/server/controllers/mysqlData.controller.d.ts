import { Request, Response, NextFunction } from 'express';
declare const mySQLdataController: {};
/**
 * mySQLdataController.getSchema
 * @param {string} hostname - A required string with database hostname
 * @param {string} password - A required string with database password
 * @param {string} port - A required string with database port
 * @param {string} username - A required string with database username
 * @param {string} databaseName - A required string with the database name
 **/
export declare const getSchema: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * mySQLdataController.objSchema
 * Iterates through data tables received from mySQL server
 * Builds object to be returned to front-end
 */
export declare const objSchema: (_req: Request, res: Response, next: NextFunction) => void;
export default mySQLdataController;
//# sourceMappingURL=mysqlData.controller.d.ts.map