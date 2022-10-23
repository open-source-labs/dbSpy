import { Express, Request, Response } from 'express'
import { handleGoogleAuth } from './controllers/sessionsController'
// import { getAuthenticatedClient, handleOAuthCallBack } from './controllers/googleAuth';

function routes(app: Express) {
    app.get('/api/healthcheck', (req, res) => res.sendStatus(200))

    app.get('/api/oauth/google', handleGoogleAuth)
}

export default routes;