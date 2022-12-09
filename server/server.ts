import express from 'express';
import dotenv from 'dotenv'
import log from './logger/index'
import routes from './routes'
dotenv.config()

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.listen(3000, () => {
    log.info(`Securely Running at ${port}`);
    routes(app);
});

export default app;