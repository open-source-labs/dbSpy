const fs = require('fs');
const dataController = {};
const path = require("path");
//const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Creating global empty arrays to hold foreign keys, primary keys, and tableList
let foreignKeyList = [];
let primaryKeyList = [];
let tableList = [];
let exportedTables = 0; 


function postgresDumpQuery(hostname, password, port, username, database_name) {
  const command = [];
  const currentDateTime = new Date();
  const resultInSeconds = parseInt(currentDateTime.getTime() / 1000);
  const filename = path.join(__dirname, `../db_schemas/${username}${database_name}${resultInSeconds.toString()}.sql`);
  command.push(`pg_dump -s postgres://${username}:${password}@${hostname}:${port}/${database_name} > ${filename}`);
  command.push(filename);
  console.log('command created:', command);
  return command;  
}

/*
async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
*/

const writeSchema =  async (command) => {
  
  try {
    const {stdout, stderr} = await exec( command[0]);
     return stdout;
  }
  catch (error) {
    console.error(`error in WS: ${error.message}`);
    return error;  
  }
};

dataController.getSchema =   (req, res, next) => {
    console.log("running getSchema controller...");
    const hostname = 'arjuna.db.elephantsql.com';
    const password = 'qsEqj2YTd-En5XI0Bv5kwvrp_S7TD7cR';
    const port = '5432';
    const username = 'twvoyfda';
    const database_name = 'twvoyfda';
    const command = postgresDumpQuery(hostname,password,port, username, database_name);
    console.log(command, '<-command');
    writeSchema(command).then(res => {
      console.log(res, 'response obj');
      console.log(command[1], 'command[1] output');
      fs.readFile(command[1], 'utf8', (error, data) => {
        if (error) 
          {
            console.error(`error- in FS: ${error.message}`);
            return next({
            msg: 'Error reading database schema file',
            err: error});    
          }
        parseSql(data);
      }); 
    console.log("test");
    
    });
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
    this.ReferencesPropertyName = null
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

  /*  Function 
      Section   */

  // Creates propertyModel and assigns properties to arguments passed in
  function createProperty(name, tableName, foreignKey, isPrimaryKey) {
    const property = new PropertyModel;
    const isForeignKey = foreignKey !== undefined && foreignKey !== null;
    property.Name = name;
    property.TableName = tableName;
    property.IsForeignKey = isForeignKey;
    property.IsPrimaryKey = isPrimaryKey;
    return property;
  };

  // Creates a new table with name property assigned to argument passed in
  function createTable(name) {
    const table = new TableModel;
    table.Name = name;
    // Increment exported tables count
    exportedTables++;
    return table;
  }

  // Creates foreignKeyModel and assigns properties to arguments passed in
  function createForeignKey(primaryKeyName, primaryKeyTableName, referencesPropertyName, referencesTableName, isDestination) {
    const foreignKey = new ForeignKeyModel;
    foreignKey.PrimaryKeyTableName = primaryKeyTableName;
    foreignKey.PrimaryKeyName = primaryKeyName;
    foreignKey.ReferencesPropertyName = referencesPropertyName;
    foreignKey.ReferencesTableName = referencesTableName;
    foreignKey.IsDestination = (isDestination !== undefined && isDestination !== null) ? isDestination : false;
    return foreignKey;
  }
  
  // Creates primaryKeyModel and assigns properties to arguments passed in 
  function createPrimaryKey(primaryKeyName, primaryKeyTableName) {
    const primaryKey = new PrimaryKeyModel;
    primaryKey.PrimaryKeyTableName = primaryKeyTableName;
    primaryKey.PrimaryKeyName = primaryKeyName;
    return primaryKey;
  }

  // Parses foreign key with SQL Server syntax
  function parseSQLServerForeignKey(name, currentTableModel, propertyType) {
    // Regex expression to find referenced foreign table 
    const referencesIndex = name.match(/(?<=REFERENCES\s)([a-zA-Z_]+)(\([a-zA-Z_]*\))/);
    
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
    };
    
    // Create ForeignKey with IsDestination = false
    const foreignKeyOriginModel = createForeignKey(foreignKey, currentTableModel.Name, referencedPropertyName, referencedTableName, false);

    // Add ForeignKey Origin
    foreignKeyList.push(foreignKeyOriginModel);

    // Create ForeignKey with IsDestination = true
    const foreignKeyDestinationModel = createForeignKey(referencedPropertyName, referencedTableName, foreignKey, currentTableModel.Name, true);
    
    // Add ForeignKey Destination
    foreignKeyList.push(foreignKeyDestinationModel);

    // Create Property
    const propertyModel = createProperty(foreignKey, currentTableModel.Name, null, false);

    // If property is both primary key and foreign key, set IsPrimaryKey property to true
    if (propertyType === 'SQLServer both') {
      propertyModel.IsPrimaryKey = true;
    }

    // Add Property to table
    currentTableModel.Properties.push(propertyModel);
  }
  
  function parseMySQLForeignKey(name, currentTableModel) {
    // Parsing Foreign Key from MySQL syntax
    name = name.replace(/\"/g, '');
    let foreignKeyName = name.match(/(?<=FOREIGN\sKEY\s)(\([a-zA-Z_]+\))(?=\sREFERENCES\s)/)[0].replace(/\(|\)/g, '');
    const referencedTableName = name.match(/(?<=REFERENCES\s)([a-zA-Z_]+)(?=\()/)[0];
    const referencedPropertyName = name.match(/(?<=REFERENCES\s[a-zA-Z_]+)(\([a-zA-Z_]+\))/)[0].replace(/\(|\)/g, '');

    // Look through current table and reassign isForeignKey prop to true, reassign foreignKeyName to include type
    currentTableModel.Properties.forEach(property => {
      if (property.Name.split(' ')[0] === foreignKeyName) {
        property.IsForeignKey = true;
        foreignKeyName = property.Name;
      }
    });

    // Create ForeignKey
    const foreignKeyOriginModel = createForeignKey(foreignKeyName, currentTableModel.Name, referencedPropertyName, referencedTableName, false);

    // Add ForeignKey Origin
    foreignKeyList.push(foreignKeyOriginModel);

    // Create ForeignKey
    const foreignKeyDestinationModel = createForeignKey(referencedPropertyName, referencedTableName, foreignKeyName, currentTableModel.Name, true);

    // Add ForeignKey Destination
    foreignKeyList.push(foreignKeyDestinationModel);
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
    foreignKeyList.forEach(function (foreignKeyModel) {
      tableList.forEach(function (tableModel) {
        if (tableModel.Name === foreignKeyModel.ReferencesTableName) {
          tableModel.Properties.forEach(function (propertyModel) {
            if (propertyModel.Name === foreignKeyModel.ReferencesPropertyName) {
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
    if (name.lastIndexOf(']') === (name.length - 1)) {
      name = name.substring(0, name.length - 1);
    }
    if (name.lastIndexOf(')') === (name.length - 1)) {
      name = name.substring(0, name.length - 1);
    }
    if (name.lastIndexOf('(') === (name.length - 1)) {
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
    tableName = tableName.trim();
    let currentTableModel;
    tableList.forEach(tableModel => {
      if (tableModel.Name === tableName) {
        currentTableModel = tableModel;
      }
    });
    if (constraint.indexOf('FOREIGN KEY') !== -1) {
      const name = constraint.substring(constraint.indexOf('FOREIGN KEY'), constraint.length - 1);
      parseMySQLForeignKey(name, currentTableModel);
    } else if (constraint.indexOf('PRIMARY KEY') !== -1) {
      const name = constraint.substring(constraint.indexOf('PRIMARY KEY'), constraint.length - 1);
      parseMYSQLPrimaryKey(name, currentTableModel);
    }
  }

  function parseSQLServerPrimaryKey(name, currentTableModel, propertyType) {
    const primaryKey = name.replace('PRIMARY KEY (', '')
      .replace(')', '')
      .replace('PRIMARY KEY', '')
      .replace(/\"/g, '')
      .trim();

    // Create Primary Key
    const primaryKeyModel = createPrimaryKey(primaryKey, currentTableModel.Name);

    // Add Primary Key to List
    primaryKeyList.push(primaryKeyModel);

    // Create Property
    const propertyModel = createProperty(primaryKey, currentTableModel.Name, null, true);

    // Add Property to table if not both primary key and foreign key
      // If both, property is added when parsing foreign key
    if (propertyType !== 'SQLServer both') {
      currentTableModel.Properties.push(propertyModel);
    }
  }

  function parseMYSQLPrimaryKey(name, currentTableModel) {
    const primaryKeyName = name.slice(13).replace(')', '').replace(/\"/g, '');
    currentTableModel.Properties.forEach(property => {
      if (property.Name.split(' ')[0] === primaryKeyName) {
        property.IsPrimaryKey = true;
        primaryKeyList.push(property);
      }
    });
  }

  // Takes in SQL creation file as text, then parses
  function parseSql(text) {
    const lines = text.split('\n');
   let  tableCell = null;
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

      const propertyRow = tmp.substring(0, 12).toLowerCase();

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
      else if (tmp === 'ALTER TABLE') {
        parseAlterTable(lines[i + 1], lines[i + 3]);
        i += 3;
      }

      // Parse Properties 
      else if (tmp !== '(' && currentTableModel != null && propertyRow !== 'alter table ') {

        //Parse the row
        let name = tmp.substring(0, (tmp.charAt(tmp.length - 1) === ',') ? tmp.length - 1 : tmp.length);

        // Check if first 10 characters are 'constraint'
        const constraint = name.substring(0, 10).toLowerCase();
        if (constraint === 'constraint') {
          if (name.indexOf("PRIMARY KEY") !== -1) {
            name = name.substring(name.indexOf("PRIMARY KEY"), name.length).replace(/\"/g, "")
          } else if (name.indexOf("FOREIGN KEY") !== -1) {
            name = name.substring(name.indexOf("FOREIGN KEY"), name.length).replace(/\"/g, "")
          }
        }

        //Attempt to get the Key Type
        let propertyType = name.substring(0, 11).toLowerCase();
        //Add special constraints
        if (propertyType !== 'primary key' && propertyType !== 'foreign key') {
          if (tmp.indexOf("PRIMARY KEY") !== -1 && tmp.indexOf("FOREIGN KEY") !== -1) {
            propertyType = "SQLServer both";
          } else if (tmp.indexOf("PRIMARY KEY") !== -1) {
            propertyType = "SQLServer primary key";
          } else if (tmp.indexOf("FOREIGN KEY") !== -1) {
            propertyType = "SQLServer foreign key";
          }
        }
        // Verify if this is a property that doesn't have a relationship (One minute of silence for the property)
        let normalProperty = propertyType !== 'primary key' && propertyType !== 'foreign key' && propertyType !== 'SQLServer primary key' && propertyType !== 'SQLServer foreign key' && propertyType !== 'SQLServer both';

        // Parse properties that don't have relationships
        if (normalProperty) {

          // For now, skip lines with these commands
          if (name.indexOf("ASC") !== -1 ||
            name.indexOf("DESC") !== -1 ||
            name.indexOf("EXEC") !== -1 ||
            name.indexOf("WITH") !== -1 ||
            name.indexOf("ON") !== -1 ||
            name.indexOf("ALTER") !== -1 ||
            name.indexOf("/*") !== -1 ||
            name.indexOf("CONSTRAIN") !== -1 ||
            name.indexOf("SET") !== -1 ||
            name.indexOf("NONCLUSTERED") !== -1 ||
            name.indexOf("GO") !== -1 ||
            name.indexOf("REFERENCES") !== -1 ||
            name.indexOf("OIDS") !== -1) {
            continue;
          }

          // Takes quotation marks out of normal property names
          name = name.replace(/\"/g, '');

          // Create Property
          let propertyModel = createProperty(name, currentTableModel.Name, null, false, false);

          // Add Property to table
          currentTableModel.Properties.push(propertyModel);
        }

        // Parse Primary Key
        if (propertyType === 'primary key' || propertyType === 'SQLServer primary key' || propertyType === 'SQLServer both') {
          // Parse Primary Key from SQL Server syntax
          if (propertyType === 'SQLServer primary key' || propertyType === 'SQLServer both') {
            if (name.indexOf('PRIMARY KEY') !== -1 && name.indexOf('CLUSTERED') === -1) {
              parseSQLServerPrimaryKey(name, currentTableModel, propertyType);
            } 
            
            // Parsing primary key from MySQL syntax
          } else if (propertyType === 'primary key') {
            parseMYSQLPrimaryKey(name, currentTableModel);
          }
        }

        // Parse Foreign Key
        if (propertyType === 'foreign key' || propertyType === 'SQLServer foreign key' || propertyType === 'SQLServer both') {
          // Parse Foreign Key from SQL Server syntax
          if (propertyType === 'SQLServer foreign key' || propertyType === 'SQLServer both') {
            let completeRow = name;
            if (name.indexOf('REFERENCES') === -1) {
              const referencesRow = (lines[i + 1]).trim();
              completeRow = 'ALTER TABLE [dbo].[' + currentTableModel.Name + ']  WITH CHECK ADD' + ' ' + name + ' ' + referencesRow;
            }
            parseSQLServerForeignKey(completeRow, currentTableModel, propertyType);
          }
          else {
            parseMySQLForeignKey(name, currentTableModel);
          }
        }
      } 
    }

    // Process Primary Keys
    processPrimaryKey();

    // Process Foreign Keys
    processForeignKey();

    createTableUI();
    

  }


  // Declare various model classes


  
  


  /*  Function 
      Section   */

      function createTableUI() {
       
        console.log('TableList', tableList)
        tableList.forEach(function (tableModel) {
          // Push in string code to d3tables array to render table name as a row
          //console.log('TableModel Name:', tableModel);
        
        console.log('table name:', tableModel.Name);
        
        for (let ref in tableModel.Properties)
        console.log('object:', tableModel.Properties[ref]);

      
    
        
          }

        );
          
        // Loop through foreign keys for parsing relationships and drawing out 
        // arrows with graphviz to depict how tables are related
        /*
        foreignKeyList.forEach(ForeignKeyModel => {
          if (!ForeignKeyModel.IsDestination) {
           
            console.log('PrimaryKey Name', ForeignKeyModel.PrimaryKeyTableName);
        
          }
        });
        */
        // Closing curly brace for ending out graphviz syntax string
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
  
  dataController.getAllSchemas = (req, res) => {

  };

  dataController.openSchema = (req, res) => {
    
  };
  dataController.postSchema = (req, res) => {
    
  };
  dataController.saveSchema = (req, res) => {
    
  };
  dataController.deleteSchema = (req, res) => {
    
  }; 
  
  
  

module.exports = dataController;