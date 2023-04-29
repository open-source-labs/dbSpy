import { Request, Response, NextFunction, RequestHandler } from 'express';
//import { MicrosoftTableColumns, MicrosoftTableSchema } from '@/Types';
import { MicrosoftDataSource } from '../datasource';
//import { microsoftFormatTableSchema } from './helperFunctions/mysql.functions';

export const microsoftQuery: RequestHandler = async (_req: Request, _res: Response, next: NextFunction) => {
    try {
        await MicrosoftDataSource.initialize();
        console.log('Data Source has been initialized');
        return next();
    } catch(err: unknown) {
        return next(err);
    }
};