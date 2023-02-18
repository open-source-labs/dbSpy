import { RequestHandler } from 'express';
import { Client } from 'pg';
import parsePgResult from '../utils/parsePgResult';
import log from '../logger/index';

/**
 * Take user input, request schema from database, parse resulting schema, pass parsed data to next middleware.
 */
export const getSchema: RequestHandler = async (req, res, next) => {
  log.info('Server received Postgres database URI.');

  const schemaQuery = `SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name != 'pg_stat_statements'
    ORDER BY table_name, ordinal_position;`;

  const keyQuery = `SELECT 
      tc.constraint_name,
      tc.table_name, 
      kcu.column_name, 
      tc.constraint_type,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON rc.unique_constraint_name = ccu.constraint_name
    WHERE 
      tc.constraint_type = 'PRIMARY KEY' OR tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';`;

  const { hostname, password, port, username, database_name } = req.query;
  if (
    typeof hostname !== 'string' ||
    typeof password !== 'string' ||
    typeof port !== 'string' ||
    typeof username !== 'string' ||
    typeof database_name !== 'string'
  )
    return next({
      message: 'TypeError: req.query key values must be strings',
    });

  const client = new Client({
    host: hostname,
    port: parseInt(port),
    user: username,
    password,
    database: database_name,
  });

  try {
    await client.connect();
    log.info('Connected to Postgres database');

    const result = await Promise.all([client.query(schemaQuery), client.query(keyQuery)]);
    const [pgSchema, pgKeys] = result;

    res.locals.data = parsePgResult(pgSchema.rows, pgKeys.rows);
    return next();
  } catch (err) {
    return next({
      message: 'Error querying database',
      log: err,
    });
  }
};
