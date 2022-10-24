import { createPool } from 'mysql2';
import dotenv from 'dotenv'
import log from '../logger/index'
dotenv.config()
// create the connection to db
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found');

const connect = () => {
    const dbUri = process.env.DATABASE_URL;

    try {
        const pool = createPool({ uri: dbUri });
        return pool;
    } catch {
        log.info('Could not connect to DB');
        process.exit(1);
    }
}

log.info('Connected to DB')



export { connect }

