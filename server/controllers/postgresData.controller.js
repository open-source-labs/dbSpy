const fs = require('fs');
import log from '../logger/index';
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Pool } = require('pg');

const parseSql = require('../../src/parse.js');

/**
 * Postgres Dump Query
 * Formulates an array with a pg_dump query at position 0, and a filename for dump location at position 1.
 * @param {string} hostname - A required string with database hostname
 * @param {string} password - A required string with database password
 * @param {string} port - A required string with database port
 * @param {string} username - A required string with database username
 * @param {string} databaseName - A required string with the database name
 * @return {string[]} command - Array containing pg_dump query and destination filename
 */
function postgresDumpQuery(hostname, password, port, username, databaseName) {
  const command = [];
  const currentDateTime = new Date();
  const resultInSeconds = parseInt(currentDateTime.getTime() / 1000);
  const filename = path.join(
    __dirname,
    `../db_schemas/${username}${databaseName}${resultInSeconds.toString()}.sql`
  );
  command.push(
    `pg_dump -s postgres://${username}:${password}@${hostname}:${port}/${databaseName} > ${filename}`
  );
  command.push(filename);
  return command;
}

/**
 * writeSchema
 * Executes pg_dump and writes to destination file
 * @param {string[]} command - Array containing pg_dump query and destination filename
 */
const writeSchema = async (command) => {
  try {
    const { stdout, stderr } = await exec(command[0]);
    return stdout;
  } catch (error) {
    console.error(`error in WS: ${error.message}`);
    return error;
  }
};

/**
 * getSchema
 * Option 1 - Production:
 * Take user input, request db_dump from database, parse resulting db dump, pass parsed data to next middleware.
 *
 * Option2 - Dev: Use .sql file provided in db_schema and parse, pass parsed data to next middleware.
 */
export const getSchema = (req, res, next) => {
  log.info('Server received Postgres database URI.');
  // // Option 1 - Production
  let result = null;
  //using destructuring for concise code, commented out lines
  const { hostname, password, port, username, database_name } = req.body;

  const command = postgresDumpQuery(hostname, password, port, username, database_name);

  writeSchema(command).then((resq) => {
    fs.readFile(command[1], 'utf8', (error, data) => {
      if (error) {
        console.error(`error- in FS: ${error.message}`);
        return next({
          msg: 'Error reading database schema file',
          err: error,
        });
      }

      result = parseSql.default(data);
      res.locals.data = result;
      next();
    });
  });
};


export const handleQueries = async (req, res, next) => {
  /* Assumption, being passed an array of queries in req.body
  grab PG_URI from user when they connect to DB

  Loop through array of queries and add them to a query string, if return query, add their outputs to the query string instead

  Execute the resulting query string as a transaction */

  /**
   * Handshake block
   */
  // Production values
  const { uri, queries } = req.body;
  const PG_URI = uri;

  /**
   * Function definition and initialization block
   */
  const pool = new Pool({
    connectionString: PG_URI,
  });

  const execQueries = (text, params, callback) => {
    return pool.query(text, params, callback);
  };

  const transactionQuery = async (queryString) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (let i = 0; i < arrQS.length - 1; i++) {
        await client.query(arrQS[i]);
      }
      await client.query('COMMIT');
    } catch (err) {
      console.log({ err }, '<err\n\n');
      console.log('--Invalid query detected in handleQueries\n--Transaction declined');
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  };

  /**
   * Build out query string
   * Iterates through queries and conditionally adds either the query or the output of the query to queryStr
   */
  let queryStr = '';
  for (let i = 0; i < queries.length; i++) {
    if (queries[i].type === 'returnQuery') {
      // execute & whatever returns, we concat to queryStr
      const newQuery = await execQueries(queries[i].query);
      queryStr = queryStr.concat(newQuery);
    } else queryStr = queryStr.concat(queries[i].query);
  }

  /**
   * Transaction implementation
   * Wraps the query string in BEGIN and COMMIT to ensure that the queries are either all execute, or none do. CANNOT JUST WRAP THE QUERY IN BEGIN AND COMMIT AS PER node-postgres documentation.
   */
  res.locals.success = false;

  const arrQS = queryStr.split(';');
  for (let i = 0; i < arrQS.length; i++) {
    arrQS[i] += ';';
  }
  transactionQuery(arrQS)
    .then(() => {
      res.locals.success = true;
      return next();
    })
    .catch((err) => {
      next({
        log: 'Error in handleQueries middleware',
        message: { err: err },
      });
    });
};
