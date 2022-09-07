const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Pool } = require('pg');
const { getParsedCommandLineOfConfigFile } = require('typescript');

function LogModel(name) {
  this.Name = name;
  this.Properties = [];
}

// sampled from dataController PropertyModel Handles all columns of log table
function LogPropertyModel() {
  this.Name = null;
  this.Setting = null;
  this.Source = null;
  this.SourceFile = null;
  this.Context = [];
  this.EnumVals = [];
}

function createLogProperty(
  name,
  setting,
  source,
  sourcefile,
  context,
  enumvals
) {
  const property = new LogPropertyModel();
  property.Name = name;
  property.Setting = setting;
  property.Source = source;
  property.SourceFile = sourcefile;
  property.Context = context;
  property.EnumVals = enumvals;
  return property;
}

const loggingController = {
  getLogInfo: async (req, res, next) => {
    const { uri } = req.body;
    const PG_URI = uri;
    const pool = new Pool({
      connectionString: PG_URI,
    });
    const getLogInfo =
      "select name, setting, source, sourcefile, context, enumvals from pg_settings where name like 'log%';";
    const client = await pool.connect();
    try {
      /*
      example query output:
      name: 'log_truncate_on_rotation',
      setting: 'off',
      source: 'default',
      sourcefile: null,
      context: 'sighup',
      enumvals: null
      */
      const logTable = new LogModel('Log_Settings');
      // query to pull loggin information from the server
      const pgSettings = await client.query(getLogInfo);
      // roll through the output and create new table rows
      for (const each of pgSettings.rows) {
        const { name, setting, source, sourcefile, context, enumvals } = each;
        const logProperties = createLogProperty(
          name,
          setting,
          source,
          sourcefile,
          context,
          enumvals
        );
        logTable.Properties.push(logProperties);
      }
      res.locals.logTable = logTable;
      return next();
    } catch (err) {
      console.log({ err }, '<err\n\n');
      console.log(
        '--You arent yet connected to a database\n--Transaction declined'
      );

      throw err;
    } finally {
      client.release();
    }
  },

  // writes the updated SQL log file to the db_schemas dir and names it after the database.
  setLogInfo: async (req, res, next) => {
    const filePath = path.resolve(
      __dirname,
      `../db_schemas/${req.body.dbName}_LogFile.sql`
    );
    await fs.writeFile(filePath, req.body.sqlLogs, (err) => {
      if (err) console.log(err);
      else {
        console.log('File written successfully\n');
      }
    });
    return next();
  },
};

module.exports = loggingController;
