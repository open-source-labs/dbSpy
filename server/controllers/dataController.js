const fs = require('fs');

const path = require('path');
//const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Pool } = require('pg');

// Creating global empty arrays to hold foreign keys, primary keys, and tableList
let foreignKeyList = [];
let primaryKeyList = [];
let tableList = [];
let exportedTables = 0;

const dataController = {};

/**
 * Postgres Dump Query
 * Formulates an array with a pg_dump query at position 0, and a filename for dump location at position 1.
 * @param {string} hostname - A required string with database hostname
 * @param {string} password - A required string with database password
 * @param {string} port - A required string with database port
 * @param {string} username - A required string with database username
 * @param {string} database_name - A required string with the database name
 * @return {string[]} command - Array containing pg_dump query and destination filename
 */
function postgresDumpQuery(hostname, password, port, username, database_name) {
  const command = [];
  const currentDateTime = new Date();
  const resultInSeconds = parseInt(currentDateTime.getTime() / 1000);
  const filename = path.join(
    __dirname,
    `../db_schemas/${username}${database_name}${resultInSeconds.toString()}.sql`
  );
  command.push(
    `pg_dump -s postgres://${username}:${password}@${hostname}:${port}/${database_name} > ${filename}`
  );
  command.push(filename);
  //console.log('command created:', command);
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
 * testDrop
 * Usage unclear - Consider removing -- NOTE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
dataController.testDrop = (req, res, next) => {
  /*
  let uri = 'postgres://cwoalfud:jqrPGXvWd8vqZydnDinBiWy1gS4C_a9J@arjuna.db.elephantsql.com/cwoalfud';

  let querytest = "DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema = 'public' AND table_constraints.table_name='films' AND constraint_type='UNIQUE' AND key_column_usage.column_name= 'title' LOOP EXECUTE 'ALTER TABLE ' || row.table_name || ' DROP CONSTRAINT ' || row.constraint_name; END LOOP; END;$$";

  const ColAfterChange = { 
    "column": "title_new",
    "constraint": " ",
    "fk": true,
    "type": "integer",
    "id": "title",
    "isNew": false,
    "pk": false,
      "References": 
        {
          "PrimaryKeyName": "_id",
          "ReferencesPropertyName": "person_id integer NOT NULL",
          "PrimaryKeyTableName": "public.people",
          "ReferencesTableName": "public.people_in_films",
          "IsDestination": false
        }    
  };

  let tableName = "public.alphabet";

  let UQueryNewCol =  'ALTER TABLE ' + tableName +
' ADD ' + ColAfterChange.column + ' ' + ColAfterChange.type;

 //querySet.push( {type:'single', query:queryForeign});

 
    const pool = new Pool({
      connectionString: uri,
    });


    pool.query(querytest).then(data => {
      return next();
    });

  
  res.locals.testresponse = UQueryNewCol; 
  next();
  */
};

/**
 * getSchema
 * Option 1 - Production:
 * Take user input, request db_dump from database, parse resulting db dump, pass parsed data to next middleware.
 *
 * Option2 - Dev: Use .sql file provided in db_schema and parse, pass parsed data to next middleware.
 */
dataController.getSchema = (req, res, next) => {
  // Option 1 - Production
  let result = null;
  console.log("running getSchema controller...");
  const hostname = req.body.hostname;
  const password = req.body.password;
  const port = req.body.port;
  const username = req.body.username;
  const database_name = req.body.database_name;
  const command = postgresDumpQuery(hostname,password,port, username, database_name);
  console.log(command, '<-command');
  writeSchema(command).then(resq => {
    fs.readFile(command[1], 'utf8', (error, data) => {
      if (error)
        {
          console.error(`error- in FS: ${error.message}`);
          return next({
          msg: 'Error reading database schema file',
          err: error});
        }
      result = parseSql(data);
      res.locals.data = result;
      next();
    });
  });
  };

//   // Option 2 - Dev
//   fs.readFile(
//     path.join(__dirname, '../db_schemas/vjcmcautvjcmcaut1657127402.sql'),
//     'utf8',
//     (error, data) => {
//       if (error) {
//         console.error(`error- in FS: ${error.message}`);
//         return next({
//           msg: 'Error reading database schema file',
//           err: error,
//         });
//       }
//       const result = parseSql(data);
//       //console.log(result);
//       //console.log('instance of table', result[records]);
//       for (let records in result) res.locals.testdata = result; // Is this for loop necessary? -- NOTE
//       next();
//     }
//   );
// };

/**
 * objSchema
 * Iterates through testdata array of tables and grabs table name.
 * Iterates through properties array and assigns field name as key for properties.
 */
dataController.objSchema = (req, res, next) => {
  // Should this still be testdata???? -- NOTE
  const data = res.locals.data;
  const results = {};

  for (let i = 0; i < data.length; i++) {
    // this outer loop will iterate through tables within data
    const properties = {};
    for (let k = 0; k < data[i].Properties.length; k++) {
      const key = data[i].Properties[k].field_name;
      properties[key] = data[i].Properties[k];
    }
    results[data[i].Name] = properties;
  }

  // console.log('route for Obj works');
  //console.log(results);

  res.locals.result = results;
  next();
};

function TableModel() {
  this.Name = null;
  this.Properties = [];
}

// Handles all columns of a table
function PropertyModel() {
  this.Name = null;
  this.Value = null;
  this.TableName = null;
  this.References = [];
  this.IsPrimaryKey = false;
  this.IsForeignKey = false;
}

function ForeignKeyModel() {
  this.PrimaryKeyName = null;
  this.ReferencesPropertyName = null;
  this.PrimaryKeyTableName = null;
  this.ReferencesTableName = null;
  this.IsDestination = false;
}

function PrimaryKeyModel() {
  this.PrimaryKeyName = null;
  this.PrimaryKeyTableName = null;
}

// Creating global empty arrays to hold foreign keys, primary keys, and tableList
foreignKeyList = [];
primaryKeyList = [];
tableList = [];

/*  Function Section   */

// Creates propertyModel and assigns properties to arguments passed in
function createProperty(name, tableName, foreignKey, isPrimaryKey) {
  const property = new PropertyModel();
  const isForeignKey = foreignKey !== undefined && foreignKey !== null;
  property.Name = name;
  property.TableName = tableName;
  property.IsForeignKey = isForeignKey;
  property.IsPrimaryKey = isPrimaryKey;
  return property;
}

// Creates a new table with name property assigned to argument passed in
function createTable(name) {
  const table = new TableModel();
  table.Name = name;
  // Increment exported tables count
  exportedTables++;
  return table;
}

// Creates foreignKeyModel and asReferencesProsigns properties to arguments passed in
function createForeignKey(
  primaryKeyName,
  primaryKeyTableName,
  referencesPropertyName,
  referencesTableName,
  isDestination
) {
  const foreignKey = new ForeignKeyModel();
  foreignKey.PrimaryKeyTableName = primaryKeyTableName;
  foreignKey.PrimaryKeyName = primaryKeyName;
  foreignKey.ReferencesPropertyName = referencesPropertyName;
  foreignKey.ReferencesTableName = referencesTableName;
  foreignKey.IsDestination =
    isDestination !== undefined && isDestination !== null
      ? isDestination
      : false;
  return foreignKey;
}

// Creates primaryKeyModel and assigns properties to arguments passed in
function createPrimaryKey(primaryKeyName, primaryKeyTableName) {
  const primaryKey = new PrimaryKeyModel();
  primaryKey.PrimaryKeyTableName = primaryKeyTableName;
  primaryKey.PrimaryKeyName = primaryKeyName;
  return primaryKey;
}

// Parses foreign key with SQL Server syntax
function parseSQLServerForeignKey(name, currentTableModel, propertyType) {
  console.log('parseSQLSERVERFK called', propertyType);
  // Regex expression to find referenced foreign table
  const referencesIndex = name.match(
    /(?<=REFERENCES\s)([a-zA-Z_]+)(\([a-zA-Z_]*\))/
  );

  // Match element at index 1 references table names
  const referencedTableName = referencesIndex[1];
  const referencedPropertyName = referencesIndex[2].replace(/\(|\)/g, '');

  // Remove everything after 'foreign key' from line
  const foreignKeyLabelIndex = name.toLowerCase().indexOf('foreign key');
  let foreignKey = name.slice(0, foreignKeyLabelIndex).trim();

  // If 'primary key' exists in line, remove 'primary key'
  const primaryKeyLabelIndex = name.toLowerCase().indexOf('primary key');
  if (primaryKeyLabelIndex >= 0) {
    foreignKey = foreignKey.slice(0, primaryKeyLabelIndex).trim();
  }

  // Create ForeignKey with IsDestination = false
  const foreignKeyOriginModel = createForeignKey(
    foreignKey,
    currentTableModel.Name,
    referencedPropertyName,
    referencedTableName,
    false
  );

  // Add ForeignKey Origin
  foreignKeyList.push(foreignKeyOriginModel);

  // Create ForeignKey with IsDestination = true
  const foreignKeyDestinationModel = createForeignKey(
    referencedPropertyName,
    referencedTableName,
    foreignKey,
    currentTableModel.Name,
    true
  );

  // Add ForeignKey Destination
  foreignKeyList.push(foreignKeyDestinationModel);

  // Create Property
  const propertyModel = createProperty(
    foreignKey,
    currentTableModel.Name,
    null,
    false
  );

  // If property is both primary key and foreign key, set IsPrimaryKey property to true
  if (propertyType === 'SQLServer both') {
    propertyModel.IsPrimaryKey = true;
  }

  // Add Property to table
  currentTableModel.Properties.push(propertyModel);
}

function parseMySQLForeignKey(name, currentTableModel, constrainName = null) {
  name = name.replace(/\"/g, '');

  let foreignKeyName = name
    .match(/(?<=FOREIGN\sKEY\s)(\([A-Za-z0-9_]+\))(?=\sREFERENCES\s)/)[0]
    .replace(/\(|\)/g, '');
  const referencedTableName = name.match(
    /(?<=REFERENCES\s)([A-Za-z0-9_]+\.[A-Za-z0-9_]+)+/
  )[0];
  //let constraintname = name.match(/(?<=CONSTRAINT\s)([A-Za-z0-9_]+)/)[0];
  let referencedPropertyName = name
    .match(/(?<=REFERENCES\s)([A-Za-z0-9_]+\.[A-Za-z0-9_()]+)+/)[0]
    .match(/\(([^()]+)\)/g)[0]
    .replace(/\(|\)/g, '');

  // console.log('foreign key Table', currentTableModel.Name);
  // console.log('ref property name', referencedPropertyName);
  // console.log('ref tablename', referencedTableName);
  // console.log('foreign key name', foreignKeyName);

  // Look through current table and reassign isForeignKey prop to true, reassign foreignKeyName to include type
  currentTableModel.Properties.forEach((property) => {
    if (property.Name.split(' ')[0] === foreignKeyName) {
      property.IsForeignKey = true;
      foreignKeyName = property.Name;
    }
  });

  let primaryTableModel = null;
  //console.log("Primary Table Model", PrimaryTableModel);

  for (let i in tableList) {
    if (tableList[i].Name == referencedTableName) {
      //console.log('primary table name', tableList[i].Name)
      //console.log('primary table found', tableList[i]);
      primaryTableModel = tableList[i];
      break;
    }
  }

  for (let k in primaryTableModel) {
    for (let l in primaryTableModel[k])
      if (primaryTableModel[k][l].Name !== undefined) {
        if (
          primaryTableModel[k][l].Name.indexOf(referencedPropertyName) !== -1
        ) {
          // console.log('name---->', primaryTableModel[k][l].Name);
          referencedPropertyName = primaryTableModel[k][l].Name;
          break;
        }
      }
  }

  // Create ForeignKey
  let foreignKeyOriginModel = createForeignKey(
    foreignKeyName,
    currentTableModel.Name,
    referencedPropertyName,
    referencedTableName,
    true
  );

  foreignKeyOriginModel.constrainName = constrainName;

  // Add ForeignKey Origin
  foreignKeyList.push(foreignKeyOriginModel);

  //Add PrimaryKey Origin
  //foreignKeyList.push(primaryKeyOriginModel);

  // Create ForeignKey
  let foreignKeyDestinationModel = createForeignKey(
    referencedPropertyName,
    referencedTableName,
    foreignKeyName,
    currentTableModel.Name,
    false
  );

  foreignKeyDestinationModel.constrainName = constrainName;
  // Add ForeignKey Destination
  foreignKeyList.push(foreignKeyDestinationModel);

  // console.log('fk List--------->', foreignKeyList);
}

// Iterates through primaryKeyList and checks every property in every table
// If primaryKeyList.Name === propertyModel.Name, set IsPrimaryKey property to true
function processPrimaryKey() {
  primaryKeyList.forEach(function (primaryModel) {
    tableList.forEach(function (tableModel) {
      if (tableModel.Name === primaryModel.PrimaryKeyTableName) {
        tableModel.Properties.forEach(function (propertyModel) {
          if (propertyModel.Name === primaryModel.PrimaryKeyName) {
            propertyModel.IsPrimaryKey = true;
          }
        });
      }
    });
  });
}

// Iterates through foreignKeyList and checks every property in every table
// If propertyModel's name equals what the foreignKeyModel is referencing, set propertyModel.IsForeignKey to true and add foreignKeyModel to propertyModel.References array
function processForeignKey() {
  //console.log("processForeign Key Called")
  foreignKeyList.forEach(function (foreignKeyModel) {
    //console.log('fk list' ,foreignKeyModel);
    tableList.forEach(function (tableModel) {
      if (tableModel.Name === foreignKeyModel.ReferencesTableName) {
        tableModel.Properties.forEach(function (propertyModel) {
          // console.log("PropertyModel.name---->", propertyModel.name);
          // console.log("ForeignKeyModel Ref Name--->", foreignKeyModel.ReferencesPropertyName);
          // console.log('prop model name', propertyModel.Name);
          if (propertyModel.Name === foreignKeyModel.ReferencesPropertyName) {
            //console.log("References Pair Found");
            propertyModel.IsForeignKey = true;
            propertyModel.References.push(foreignKeyModel);
          }
        });
      }
    });
  });
}

// Parses table name from CREATE TABLE line
function parseSQLServerName(name, property) {
  name = name.replace('[dbo].[', '');
  name = name.replace('](', '');
  name = name.replace('].[', '.');
  name = name.replace('[', '');
  if (property == undefined || property == null) {
    name = name.replace(' [', '');
    name = name.replace('] ', '');
  } else {
    if (name.indexOf(']') !== -1) {
      name = name.substring(0, name.indexOf(']'));
    }
  }
  if (name.lastIndexOf(']') === name.length - 1) {
    name = name.substring(0, name.length - 1);
  }
  if (name.lastIndexOf(')') === name.length - 1) {
    name = name.substring(0, name.length - 1);
  }
  if (name.lastIndexOf('(') === name.length - 1) {
    name = name.substring(0, name.length - 1);
  }
  name = name.replace(' ', '');
  return name;
}

// Checks whether CREATE TABLE query has '(' on separate line
function parseTableName(name) {
  if (name.charAt(name.length - 1) === '(') {
    name = parseSQLServerName(name);
  }
  return name;
}

function parseAlterTable(tableName, constraint) {
  // const tableName = tmp.match(/(?<=ALTER\sTABLE\s)([a-zA-Z_]+)(?=\sADD\sCONSTRAINT)/)[0];

  // console.log('tableName in parseAlterTable------>', tableName);

  const regexConstraint = /(?<=CONSTRAINT\s)([a-zA-Z_]+)/;
  const constrainName = constraint.match(regexConstraint);

  // if (constrainName !== null) console.log('constraintName', constrainName[0]);

  tableName = tableName.trim();
  let currentTableModel;
  tableList.forEach((tableModel) => {
    if (tableModel.Name === tableName) {
      currentTableModel = tableModel;
      //console.log('currentTableModel ', currentTableModel);
    }
  });

  if (constraint.indexOf('FOREIGN KEY') !== -1) {
    //console.log('fk found---------->');
    const name = constraint.substring(
      constraint.indexOf('FOREIGN KEY'),
      constraint.length - 1
    );
    //  console.log('foreign key', name)
    // console.log(currentTableModel);
    parseMySQLForeignKey(
      name,
      currentTableModel,
      constrainName !== null ? constrainName[0] : null
    );
  } else if (constraint.indexOf('PRIMARY KEY') !== -1) {
    //console.log('pk found ------>');
    const name = constraint.substring(
      constraint.indexOf('PRIMARY KEY'),
      constraint.length - 1
    );
    parseMYSQLPrimaryKey(name, currentTableModel);
    //console.log('primary key', name);
    //console.log(currentTableModel);
  }
}

function parseSQLServerPrimaryKey(name, currentTableModel, propertyType) {
  const primaryKey = name
    .replace('PRIMARY KEY (', '')
    .replace(')', '')
    .replace('PRIMARY KEY', '')
    .replace(/\"/g, '')
    .trim();

  // Create Primary Key
  const primaryKeyModel = createPrimaryKey(primaryKey, currentTableModel.Name);

  // Add Primary Key to List
  primaryKeyList.push(primaryKeyModel);

  // Create Property
  const propertyModel = createProperty(
    primaryKey,
    currentTableModel.Name,
    null,
    true
  );

  // Add Property to table if not both primary key and foreign key
  // If both, property is added when parsing foreign key
  if (propertyType !== 'SQLServer both') {
    currentTableModel.Properties.push(propertyModel);
  }
}

function parseMYSQLPrimaryKey(name, currentTableModel) {
  const primaryKeyName = name.slice(13).replace(')', '').replace(/\"/g, '');

  currentTableModel.Properties.forEach((property) => {
    if (property.Name.split(' ')[0] === primaryKeyName) {
      property.IsPrimaryKey = true;
      primaryKeyList.push(property);
    }
  });
}

// Takes in SQL creation file as text, then parses
function parseSql(text) {
  const lines = text.split('\n');
  let tableCell = null;
  let cells = [];
  exportedTables = 0;
  tableList = [];
  foreignKeyList = [];
  primaryKeyList = [];

  let currentTableModel = null;

  //Parse SQL to objects
  for (let i = 0; i < lines.length; i++) {
    let rowCell = null;

    const tmp = lines[i].trim();

    const propertyRow = tmp.substring(0, 12).toLowerCase().trim();

    if (currentTableModel !== null && tmp.includes(');')) {
      tableList.push(currentTableModel);
      currentTableModel = null;
    }

    //Parse Table
    if (propertyRow === 'create table') {
      //Parse row
      let name = tmp.substring(12).trim();

      //Parse Table Name
      name = parseTableName(name);

      //Create Table
      currentTableModel = createTable(name);
    }
    // tmp === 'ALTER TABLE'
    else if (propertyRow == 'alter table') {
      let alterQuerySplit = tmp.toLowerCase().trim();
      let tname = null;

      for (let i = 0; i < tableList.length; i++) {
        if (alterQuerySplit.indexOf(tableList[i].Name) !== -1) {
          tname = tableList[i].Name;
        }
      }

      parseAlterTable(tname, lines[i + 1]);
      i += 3;
    }

    // Parse Properties Primarily for field props of Tables
    else if (
      tmp !== '(' &&
      currentTableModel !== null &&
      propertyRow !== 'alter table '
    ) {
      //Parse the row
      let name = tmp.substring(
        0,
        tmp.charAt(tmp.length - 1) === ',' ? tmp.length - 1 : tmp.length
      );
      //console.log('name after format', name);
      // Check if first 10 characters are 'constraint'
      const constraint = name.substring(0, 10).toLowerCase();
      if (constraint === 'constraint') {
        //double checking for constraints here
        //console.log("constraint detected");
        if (name.indexOf('PRIMARY KEY') !== -1) {
          name = name
            .substring(name.indexOf('PRIMARY KEY'), name.length)
            .replace(/\"/g, '');
        } else if (name.indexOf('FOREIGN KEY') !== -1) {
          name = name
            .substring(name.indexOf('FOREIGN KEY'), name.length)
            .replace(/\"/g, '');
        }
      }

      //Attempt to get the Key Type
      let propertyType = name.substring(0, 11).toLowerCase();
      //Add special constraints
      if (propertyType !== 'primary key' && propertyType !== 'foreign key') {
        if (
          tmp.indexOf('PRIMARY KEY') !== -1 &&
          tmp.indexOf('FOREIGN KEY') !== -1
        ) {
          propertyType = 'SQLServer both';
        } else if (tmp.indexOf('PRIMARY KEY') !== -1) {
          propertyType = 'SQLServer primary key';
        } else if (tmp.indexOf('FOREIGN KEY') !== -1) {
          propertyType = 'SQLServer foreign key';
        }
      }
      // Verify if this is a property that doesn't have a relationship (One minute of silence for the property)
      let normalProperty =
        propertyType !== 'primary key' &&
        propertyType !== 'foreign key' &&
        propertyType !== 'SQLServer primary key' &&
        propertyType !== 'SQLServer foreign key' &&
        propertyType !== 'SQLServer both';

      //console.log('property row', propertyRow)
      // Parse properties that don't have relationships
      if (normalProperty) {
        // For now, skip lines with these commands
        if (
          name.indexOf('ASC') !== -1 ||
          name.indexOf('DESC') !== -1 ||
          name.indexOf('EXEC') !== -1 ||
          name.indexOf('WITH') !== -1 ||
          name.indexOf('ON') !== -1 ||
          name.indexOf('ALTER') !== -1 ||
          name.indexOf('/*') !== -1 ||
          name.indexOf('CONSTRAIN') !== -1 ||
          name.indexOf('SET') !== -1 ||
          name.indexOf('NONCLUSTERED') !== -1 ||
          name.indexOf('GO') !== -1 ||
          name.indexOf('REFERENCES') !== -1 ||
          name.indexOf('OIDS') !== -1
        ) {
          continue;
        }

        // Takes quotation marks out of normal property names
        name = name.replace(/\"/g, '');

        // Create Property
        let propertyModel = createProperty(
          name,
          currentTableModel.Name,
          null,
          false,
          false
        );

        // Add Property to table
        currentTableModel.Properties.push(propertyModel);
      }

      // Parse Primary Key
      if (
        propertyType === 'primary key' ||
        propertyType === 'SQLServer primary key' ||
        propertyType === 'SQLServer both'
      ) {
        // Parse Primary Key from SQL Server syntax
        if (
          propertyType === 'SQLServer primary key' ||
          propertyType === 'SQLServer both'
        ) {
          if (
            name.indexOf('PRIMARY KEY') !== -1 &&
            name.indexOf('CLUSTERED') === -1
          ) {
            parseSQLServerPrimaryKey(name, currentTableModel, propertyType);
          }

          // Parsing primary key from MySQL syntax
        } else if (propertyType === 'primary key') {
          parseMYSQLPrimaryKey(name, currentTableModel);
        }
      }

      // Parse Foreign Key
      if (
        propertyType === 'foreign key' ||
        propertyType === 'SQLServer foreign key' ||
        propertyType === 'SQLServer both'
      ) {
        // Parse Foreign Key from SQL Server syntax
        if (
          propertyType === 'SQLServer foreign key' ||
          propertyType === 'SQLServer both'
        ) {
          let completeRow = name;
          if (name.indexOf('REFERENCES') === -1) {
            const referencesRow = lines[i + 1].trim();
            completeRow =
              'ALTER TABLE [dbo].[' +
              currentTableModel.Name +
              ']  WITH CHECK ADD' +
              ' ' +
              name +
              ' ' +
              referencesRow;
          }
          parseSQLServerForeignKey(
            completeRow,
            currentTableModel,
            propertyType
          );
        } else {
          parseMySQLForeignKey(name, currentTableModel);
        }
      }
    }
  }

  // Process Primary Keys
  processPrimaryKey();

  // Process Foreign Keys
  processForeignKey();

  for (let i in tableList) {
    for (let k in tableList[i].Properties) {
      if (tableList[i].Properties[k] !== undefined) {
        let composite =
          tableList[i].Properties[k].Name.match(/^(\S+)\s(.*)/).slice(1);

        let value = composite[1].search(/NOT/i);
        if (value > 0) {
          let type = composite[1].substring(0, value - 1);
          let additional_constraints = composite[1].substring(value);

          tableList[i].Properties[k].field_name = composite[0];
          tableList[i].Properties[k].data_type = type;
          tableList[i].Properties[k].additional_constraints =
            additional_constraints;
        } else {
          let type = composite[1].substring(value);
          let additional_constraints = null;
          tableList[i].Properties[k].field_name = composite[0];
          tableList[i].Properties[k].data_type = type;
          tableList[i].Properties[k].additional_constraints =
            additional_constraints;
        }
      }
    }
  }

  //console.log(tableList);
  return tableList;
}

/*  Function 
      Section   */

function createTableUI() {
  //console.log('TableList', tableList);
  tableList.forEach(function (tableModel) {
    // Push in string code to d3tables array to render table name as a row
    //console.log('TableModel Name:', tableModel);

    // console.log('table name:', tableModel.Name);

    //console.log('object:', tableModel.Properties[ref]);
    for (let ref in tableModel.Properties);
  });

  return tableList;
}
// functions to handle mouseover to depict related tables only

// Adding Primary Key and Foreign Key designations for table columns
function checkSpecialKey(propertyModel) {
  if (propertyModel.IsForeignKey && propertyModel.IsPrimaryKey) {
    return 'PK | FK';
  } else if (propertyModel.IsForeignKey) {
    return 'FK';
  } else if (propertyModel.IsPrimaryKey) {
    return 'PK';
  } else {
    return '';
  }
}

dataController.getAllSchemas = (req, res) => {};

dataController.openSchema = (req, res, next) => {
  fs.readFile(
    '/Users/phoenix/Documents/GitHub/osp/JAKT/server/db_schemas/vjcmcautvjcmcaut1657127402.sql',
    'utf8',
    (error, data) => {
      if (error) {
        console.error(`error- in FS: ${error.message}`);
        return next({
          msg: 'Error reading database schema file',
          err: error,
        });
      }
      let result = parseSql(data);
      //console.log(result);
      /*
          for (let i in result) {
            for (let k in result[i].Properties)
            {
            if (result[i].Properties[k] !== undefined)
            {
             let composite = result[i].Properties[k].Name.match(/^(\S+)\s(.*)/).slice(1);
             
             let value = composite[1].search(/NOT/i);
             if (value > 0)
             {let type = composite[1].substring(0, value -1);
             let additional_constraints = composite[1].substring(value);
              
             
             result[i].Properties[k].field_name = composite[0];
             result[i].Properties[k].data_type = type; 
             result[i].Properties[k].additional_constraints = additional_constraints;
             console.log(result[i].Properties[k]);
             }
             else
             {
              let type = composite[1].substring(value);
              let additional_constraints = null;
              result[i].Properties[k].field_name = composite[0];
              result[i].Properties[k].data_type = type; 
              result[i].Properties[k].additional_constraints = additional_constraints;
              console.log(result[i].Properties[k]);
             }
            }

          }

          }
*/

      //console.log(result);
      next();
    }
  );
};

dataController.postSchema = (req, res) => {};

dataController.handleQueries = async (req, res, next) => {
  /* Assumption, being passed an array of queries in req.body
  grab PG_URI from user when they connect to DB

  Loop through array of queries and add them to a query string, if return query, add their outputs to the query string instead

  Execute the resulting query string as a transaction */

  /**
   * Handshake block
   */
  // Production values
  const {uri, queries} = req.body;
  const PG_URI = uri;

  // // Test values
  // const PG_URI =
  //   'postgres://gmovmnlt:hXTU9fM8rDK7QAfxRczw-amgLDtry4v-@castor.db.elephantsql.com/gmovmnlt';
  // console.log('Data received from Client', req.body);
  // const queries = [
  //   {
  //     type: 'single',
  //     query: 'SELECT * FROM public.films;',
  //   },
  //   {
  //     type: 'single',
  //     query: 'SELECT * FROM public.pefdgdfshsople;',
  //   },
  // ];

  /**
   * Function definition and initialization block
   */
  const pool = new Pool({
    connectionString: PG_URI,
  });

  const execQueries = (text, params, callback) => {
    console.log('executed query', text);
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
      console.log({err}, "<err\n\n");
      console.log(
        '--Invalid query detected in handleQueries\n--Transaction declined'
      );
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
      //execute & whatever returns, we concat to queryStr
      const newQuery = await execQueries(queries[i].query);
      queryStr = queryStr.concat(newQuery);
    } else queryStr = queryStr.concat(queries[i].query);
  }

  // console.log(queryStr);

  /**
   * Transaction implementation
   * Wraps the query string in BEGIN and COMMIT to ensure that the queries are either all execute, or none do. CANNOT JUST WRAP THE QUERY IN BEGIN AND COMMIT AS PER node-postgres documentation.
   */
  res.locals.success = false;

  console.log(queryStr, "Query string");
  const arrQS = queryStr.split(';');
  for (let i = 0; i < arrQS.length; i++) {
    arrQS[i] += ';';
  }
  console.log(arrQS, "<Query array");
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

dataController.saveSchema = (req, res) => {};
dataController.deleteSchema = (req, res) => {};

module.exports = dataController;
