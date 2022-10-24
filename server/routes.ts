import { Express, Request, Response, NextFunction } from 'express';
import { handleGoogleAuth } from './controllers/sessionsController';
import { router } from './routes/api';
import apiMySQLRouter from './routes/apiMySQL';



function routes(app: Express) {
    app.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

    app.get('/api/oauth/google', handleGoogleAuth)

    app.get('/api/sql/postgres', router)

    app.get('/api/sql/mysql', apiMySQLRouter)

    // Global Error Handler
    app.use((err: ErrorEvent, req: Request, res: Response, next: NextFunction) => {
        const defaultErr = {
            log: 'Express error handler caught unknown middleware error',
            status: 500,
            message: 'An error occurred. This is the global error handler.',
        };
        const errorObj = Object.assign({}, defaultErr, err);
        return res.status(errorObj.status).json(errorObj.message);
    });

}

export default routes;