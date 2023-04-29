import { Request, Response, NextFunction, RequestHandler } from 'express';
//import { MicrosoftTableColumns, MicrosoftTableSchema } from '@/Types';
import { DataSource } from 'typeorm';
//import { microsoftFormatTableSchema } from './helperFunctions/mysql.functions';


export const microsoftQuery: RequestHandler = async (req: Request, _res: Response, next: NextFunction) => {
    try {

        const { hostname, password, port, username, database_name } = req.query;

        const MicrosoftDataSource = new DataSource({
            type: "mssql",
            host: hostname as string,
            port: port ? parseInt(port as string) : 1433,
            username: username as string,
            password: password as string,
            database: database_name as string,
            synchronize: true,
            logging: true,
          });


        await MicrosoftDataSource.initialize();
        console.log('Data Source has been initialized');
        return next();
    } catch(err: unknown) {
        return next(err);
    }
};