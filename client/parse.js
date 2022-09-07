//objSchema controller allows the user to obj data to more
//usable format for front-end
const objSchema = (testdata) => {
   
    const results = {};
    //iterate through the testdata Array
    //Grab name property for each element of array - Table Name
    //Assign properties to name property of the table within new obj
    // iterate through the Properties Array
    // Assign field name as key for properties....
  
    for (let i = 0; i < testdata.length; i++) {
      // this outer loop will iterate through tables within testdata
      const properties = {};
      for (let k = 0; k < testdata[i].Properties.length; k++) {
        const key = testdata[i].Properties[k].field_name;
        properties[key] = testdata[i].Properties[k];
      }
  
      results[testdata[i].Name] = properties;
    }

   return results;
    
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
  let foreignKeyList = [];
  let primaryKeyList = [];
  let tableList = [];
  let exportedTables = 0; 
  
  /*  Function 
        Section   */
  
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
    let referencedPropertyName = name
      .match(/(?<=REFERENCES\s)([A-Za-z0-9_]+\.[A-Za-z0-9_()]+)+/)[0]
      .match(/\(([^()]+)\)/g)[0]
      .replace(/\(|\)/g, '');
  
    // Look through current table and reassign isForeignKey prop to true, reassign foreignKeyName to include type
    currentTableModel.Properties.forEach((property) => {
      if (property.Name.split(' ')[0] === foreignKeyName) {
        property.IsForeignKey = true;
        foreignKeyName = property.Name;
      }
    });
  
    let primaryTableModel = null;
  
    for (const i in tableList) {
      if (tableList[i].Name == referencedTableName) {

        primaryTableModel = tableList[i];
        break;
      }
    }
  
    for (const k in primaryTableModel) {
      for (const l in primaryTableModel[k])
        if (primaryTableModel[k][l].Name !== undefined) {
          if (
            primaryTableModel[k][l].Name.indexOf(referencedPropertyName) !== -1
          ) {
            referencedPropertyName = primaryTableModel[k][l].Name;
            break;
          }
        }
    }
  
    // Create ForeignKey
    const foreignKeyOriginModel = createForeignKey(
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
    const foreignKeyDestinationModel = createForeignKey(
      referencedPropertyName,
      referencedTableName,
      foreignKeyName,
      currentTableModel.Name,
      false
    );
  
    foreignKeyDestinationModel.constrainName = constrainName;
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
    const regexConstraint = /(?<=CONSTRAINT\s)([a-zA-Z_]+)/;
    const constrainName = constraint.match(regexConstraint);
  
    // if (constrainName !== null) console.log('constraintName', constrainName[0]);
  
    tableName = tableName.trim();
    let currentTableModel;
    tableList.forEach((tableModel) => {
      if (tableModel.Name === tableName) {
        currentTableModel = tableModel;
      }
    });
  
    if (constraint.indexOf('FOREIGN KEY') !== -1) {
      const name = constraint.substring(
        constraint.indexOf('FOREIGN KEY'),
        constraint.length - 1
      );

      parseMySQLForeignKey(
        name,
        currentTableModel,
        constrainName !== null ? constrainName[0] : null
      );
    } else if (constraint.indexOf('PRIMARY KEY') !== -1) {
      const name = constraint.substring(
        constraint.indexOf('PRIMARY KEY'),
        constraint.length - 1
      );
      parseMYSQLPrimaryKey(name, currentTableModel);
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
  export default function parseSql(text) {
    const lines = text.split('\n');
    const tableCell = null;
    const cells = [];
    exportedTables = 0;
    tableList = [];
    foreignKeyList = [];
    primaryKeyList = [];
  
    let currentTableModel = null;
  
    //Parse SQL to objects
    for (let i = 0; i < lines.length; i++) {
      const rowCell = null;
  
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
        const alterQuerySplit = tmp.toLowerCase().trim();
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
        // Check if first 10 characters are 'constraint'
        const constraint = name.substring(0, 10).toLowerCase();
        if (constraint === 'constraint') {
          //double checking for constraints here
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
        const normalProperty =
          propertyType !== 'primary key' &&
          propertyType !== 'foreign key' &&
          propertyType !== 'SQLServer primary key' &&
          propertyType !== 'SQLServer foreign key' &&
          propertyType !== 'SQLServer both';
  
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
          const propertyModel = createProperty(
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
  
    for (const i in tableList) {
      for (const k in tableList[i].Properties) {
        if (tableList[i].Properties[k] !== undefined) {
          const composite =
            tableList[i].Properties[k].Name.match(/^(\S+)\s(.*)/).slice(1);
  
          const value = composite[1].search(/NOT/i);
          if (value > 0) {
            const type = composite[1].substring(0, value - 1);
            const additional_constraints = composite[1].substring(value);
  
            tableList[i].Properties[k].field_name = composite[0];
            tableList[i].Properties[k].data_type = type;
            tableList[i].Properties[k].additional_constraints =
              additional_constraints;
          } else {
            const type = composite[1].substring(value);
            const additional_constraints = null;
            tableList[i].Properties[k].field_name = composite[0];
            tableList[i].Properties[k].data_type = type;
            tableList[i].Properties[k].additional_constraints =
              additional_constraints;
          }
        }
      }
    }
  
    return objSchema(tableList);
  }
  
  /*  Function 
        Section   */
  
  function createTableUI() {
    tableList.forEach(function (tableModel) {
      // Push in string code to d3tables array to render table name as a row
      for (const ref in tableModel.Properties);
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