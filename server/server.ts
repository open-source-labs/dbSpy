import express from 'express';
import dotenv from 'dotenv'
import log from './logger/index'
import { connect } from './utils/connect'
import routes from './routes'
// import { getAuthenticatedClient, handleOAuthCallBack } from './controllers/googleAuth';
// import { user } from './controllers/userController';
dotenv.config()

const port = 3000;
const host = 'localhost'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.listen(3000, () => {
    log.info(`Running at http://localhost:${port}`);
    routes(app);
})