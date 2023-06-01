import { RequestHandler, Request } from 'express';
import { DataSource } from 'typeorm';
export declare const dbConnect: (req: Request) => Promise<DataSource>;
export declare const addNewDbRow: RequestHandler;
export declare const updateRow: RequestHandler;
export declare const deleteRow: RequestHandler;
export declare const addNewDbColumn: RequestHandler;
export declare const updateDbColumn: RequestHandler;
export declare const deleteColumn: RequestHandler;
export declare const addNewTable: RequestHandler;
export declare const getTableNames: RequestHandler;
export declare const deleteTable: RequestHandler;
export declare const addForeignKey: RequestHandler;
export declare const removeForeignKey: RequestHandler;
//# sourceMappingURL=universal.helpers.d.ts.map