const fs = require('fs');
import log from '../logger/index';
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const parseSql = require('../../src/parse');

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
  const dbDump = path.join(__dirname, `../db_schemas/${username}${databaseName}${resultInSeconds.toString()}.dump`);
  const dbSqlText = path.join(__dirname, `../db_schemas/${username}${databaseName}${resultInSeconds.toString()}.sql`);
  command.push(
    `pg_dump -s -Fc -Z 9 postgres://${username}:${password}@${hostname}:${port}/${databaseName} > ${dbDump}`
    ,`pg_restore -f ${dbSqlText} ${dbDump} `
  );
  command.push(dbDump);
  command.push(dbSqlText);
  return command;
}

/**
 * writeSchema
 * Executes pg_dump and writes to destination file
 * @param {string[]} command - Array containing pg_dump query and destination filename
 */
const writeSchema = async (command) => {
  try {
    await exec(command[0])
    const { stdout, stderr } = await exec(command[1]);
    return stdout;
  } catch (error) {
    console.error(`error in WS: ${error.message}`);
    return error;
  }
};

/**
 * Take user input, request db_dump from database, parse resulting db dump, pass parsed data to next middleware.
 */
export const getSchema = (req, res, next) => {
  log.info('Server received Postgres database URI.');
  // // Option 1 - Production
  let result = null;
  //using destructuring for concise code, commented out lines
  const { hostname, password, port, username, database_name } = req.body;

  const command = postgresDumpQuery(hostname, password, port, username, database_name);
  
  writeSchema(command).then((resq) => {
    fs.readFile(command[3], 'utf8', (error, data) => {
      if (error) {
        console.error(`error- in FS: ${error.message}`);
        return next({
          msg: 'Error reading database schema file',
          err: error,
        });
      }
      result = parseSql.default(data);
      res.locals.data = result;
      // Delete database files 
      exec(`unlink ${command[2]} && unlink ${command[3]}`);
      next();
    });
  });
};