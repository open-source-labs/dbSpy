"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("cypress/types/lodash");
// Creating global empty arrays to hold foreign keys, primary keys, and tableList
let foreignKeyList = [];
let primaryKeyList = [];
let primaryKeyListArray = [];
let tableList = {};
;
let exportedTables = 0;
const objSchema = (testData) => {
    const results = {};
    // Iterate through the testdata Array
    // Grab name property for each element of array - Table Name
    // Assign properties to name property of the table within new obj
    // iterate through the Properties Array
    // Assign field name as key for properties....
    for (let i = 0; i < testData.length; i++) {
        // this outer loop will iterate through tables within testdata
        const properties = {};
        for (let k = 0; k < testData[i].Properties.length; k++) {
            let key = testData[i].Properties[k].field_name;
            properties[key] = testData[i].Properties[k];
        }
        results[testData[i].Name] = properties;
    }
    //
    // PATCH TO RENAME SOME DATA FIELDS
    //
    Object.keys(results).forEach((table) => {
        Object.keys(results[table]).forEach((prop) => {
            let propObj = results[table][prop];
            propObj.Name = prop;
            const ref = propObj.References;
            if (ref && ref.length > 0)
                ref.forEach((refObj) => {
                    refObj.PrimaryKeyName = prop;
                    refObj.ReferencesPropertyName = refObj.ReferencesPropertyName.slice(0, refObj.ReferencesPropertyName.indexOf(' '));
                });
            if (propObj.data_type.includes('character varying'))
                propObj.data_type = 'varchar';
            if (propObj.data_type.includes('bigint'))
                propObj.data_type = 'integer';
            if (propObj.data_type.includes('boolean'))
                propObj.data_type = 'boolean';
        });
    });
    //
    // END - PATCH
    //
    return results;
};
////////////////////
//// SQL PARSER ////
////////////////////
// interface TableModel {
//   Name: string | number | null;
//   Properties: PropertyModel[];
// }
class TableModel {
    constructor(name, properties) {
        this.Name = name;
        this.Properties = properties;
    }
}
// Handles all columns of a table
class PropertyModel {
    constructor(name, value, tableName, references, isPrimaryKey, isForeignKey) {
        this.Name = name;
        this.Value = value;
        this.TableName = tableName;
        this.References = references;
        this.IsPrimaryKey = isPrimaryKey;
        this.IsForeignKey = isForeignKey;
    }
    ;
}
;
// function PropertyModel(this:PropertyModel):void {
//   this.Name = null;
//   this.Value = null;
//   this.TableName = null;
//   this.References = [];
//   this.IsPrimaryKey = false;
//   this.IsForeignKey = false;
// }
class ForeignKeyModel {
    constructor(primaryKeyName, referencesPropertyName, primaryKeyTableName, referencesTableName, isDestination, constraintName) {
        this.PrimaryKeyName = primaryKeyName;
        this.ReferencesPropertyName = referencesPropertyName;
        this.PrimaryKeyTableName = primaryKeyTableName;
        this.ReferencesTableName = referencesTableName;
        this.IsDestination = isDestination;
        this.ConstraintName = constraintName;
    }
}
;
// interface PrimaryKeyModel {
//   PrimaryKeyName: string | null;
//   PrimaryKeyTableName: string | null;
// }
class PrimaryKeyModel {
    constructor(primaryKeyName, primaryKeyTableName) {
        this.PrimaryKeyName = primaryKeyName;
        this.PrimaryKeyTableName = primaryKeyTableName;
    }
}
// Creating global empty arrays to hold foreign keys, primary keys, and tableList
foreignKeyList = [];
primaryKeyList = [];
tableList = {};
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
function createForeignKey(primaryKeyName, primaryKeyTableName, referencesPropertyName, referencesTableName, isDestination) {
    const foreignKey = new ForeignKeyModel();
    foreignKey.PrimaryKeyTableName = primaryKeyTableName;
    foreignKey.PrimaryKeyName = primaryKeyName;
    foreignKey.ReferencesPropertyName = referencesPropertyName;
    foreignKey.ReferencesTableName = referencesTableName;
    foreignKey.IsDestination =
        isDestination !== undefined && isDestination !== null ? isDestination : false;
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
    }
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
function parseMySQLForeignKey(name, currentTableModel, constraintName = null) {
    name = name.replace(/\"/g, '');
    let foreignKeyName = (name.match(/(?<=FOREIGN\sKEY\s)(\([A-Za-z0-9_]+\))(?=\sREFERENCES\s)/) ?? [])[0];
    if (foreignKeyName) {
        foreignKeyName = foreignKeyName.replace(/\(|\)/g, '');
    }
    const referencedTableName = (name.match(/(?<=REFERENCES\s)([A-Za-z0-9_]+\.[A-Za-z0-9_]+)+/) ?? [])[0];
    // let constraintname = name.match(/(?<=CONSTRAINT\s)([A-Za-z0-9_]+)/)[0];
    let referencedPropertyName = (name.match(/(?<=REFERENCES\s)([A-Za-z0-9_]+\.[A-Za-z0-9_()]+)+/) ?? [])[0];
    if (referencedPropertyName) {
        referencedPropertyName = referencedPropertyName.match(/\(([^()]+)\)/g)?.[0]?.replace(/\(|\)/g, '');
    }
    // Look through current table and reassign isForeignKey prop to true, reassign foreignKeyName to include type
    currentTableModel.Properties.forEach((property) => {
        if (property.Name.split(' ')[0] === foreignKeyName) {
            property.IsForeignKey = true;
            foreignKeyName = property.Name;
        }
    });
    let primaryTableModel = null;
    const tlKeys = Object.keys(tableList);
    for (let i = 0; i < tlKeys.length; i++) {
        if (tableList[tlKeys[i]].Name === referencedTableName) {
            primaryTableModel = tableList[tlKeys[i]];
            break;
        }
    }
    if (primaryTableModel !== null) {
        const ptmKeys = Object.keys(primaryTableModel);
        for (let i = 0; i < ptmKeys.length; i++) {
            const ptmSubKeys = Object.keys(primaryTableModel[ptmKeys[i]]);
            for (let j = 0; j < ptmSubKeys.length; j++) {
                if (primaryTableModel[ptmKeys[i]][ptmSubKeys[j]].Name !== undefined &&
                    primaryTableModel[ptmKeys[i]][ptmSubKeys[j]].Name.indexOf(referencedPropertyName) !== -1) {
                    referencedPropertyName = primaryTableModel[ptmKeys[i]][ptmSubKeys[j]].Name;
                    break;
                }
            }
        }
    }
    // Add PrimaryKey Origin
    // foreignKeyList.push(primaryKeyOriginModel);
    // Create ForeignKey
    let foreignKeyDestinationModel = createForeignKey(referencedPropertyName, referencedTableName, foreignKeyName, currentTableModel.Name, false);
    foreignKeyDestinationModel.ConstraintName = constraintName;
    // Add ForeignKey Destination
    foreignKeyList.push(foreignKeyDestinationModel);
}
// Iterates through primaryKeyList and checks every property in every table
// If primaryKeyList.Name === propertyModel.Name, set IsPrimaryKey property to true
function processPrimaryKey() {
    primaryKeyList.forEach(function (primaryModel) {
        Object.values(tableList).forEach(function (tableModel) {
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
        Object.values(tableList).forEach(function (tableModel) {
            if (tableModel.Name === foreignKeyModel.ReferencesTableName) {
                tableModel.Properties.forEach(function (propertyModel) {
                    if (propertyModel.Name === foreignKeyModel.ReferencesPropertyName) {
                        propertyModel.IsForeignKey = true;
                        propertyModel.References.push(foreignKeyModel);
                    }
                });
            }
            if (tableModel.Name == foreignKeyModel.PrimaryKeyTableName) {
                tableModel.Properties.forEach(function (propertyModel) {
                    if (propertyModel.Name === foreignKeyModel.PrimaryKeyName) {
                        propertyModel.References.push({
                            PrimaryKeyName: foreignKeyModel.PrimaryKeyName,
                            ReferencesPropertyName: foreignKeyModel.ReferencesPropertyName,
                            PrimaryKeyTableName: foreignKeyModel.PrimaryKeyTableName,
                            ReferencesTableName: foreignKeyModel.ReferencesTableName,
                            IsDestination: true,
                            ConstraintName: foreignKeyModel.ConstraintName,
                        });
                    }
                });
            }
        });
    });
}
;
// Parses table name from CREATE TABLE line
function parseSQLServerName(name, property) {
    name = name.replace('[dbo].[', '');
    name = name.replace('](', '');
    name = name.replace('].[', '.');
    name = name.replace('[', '');
    if (property == undefined || property == null) {
        name = name.replace(' [', '');
        name = name.replace('] ', '');
    }
    else {
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
        name = parseSQLServerName(name, lodash_1.property);
    }
    return name;
}
;
function parseAlterTable(tableName, constraint) {
    const regexConstraint = /(?<=CONSTRAINT\s)([a-zA-Z_]+)/;
    const constraintName = constraint.match(regexConstraint);
    tableName = tableName.trim();
    let currentTableModel = null;
    Object.values(tableList).forEach((tableModel) => {
        if (tableModel.Name === tableName) {
            currentTableModel = tableModel;
        }
    });
    if (constraint.indexOf('FOREIGN KEY') !== -1) {
        const name = constraint.substring(constraint.indexOf('FOREIGN KEY'), constraint.length - 1);
        parseMySQLForeignKey(name, currentTableModel, constraintName !== null ? constraintName[0] : null);
    }
    else if (constraint.indexOf('PRIMARY KEY') !== -1) {
        const name = constraint.substring(constraint.indexOf('PRIMARY KEY'), constraint.length - 1);
        parseMYSQLPrimaryKey(name, currentTableModel);
    }
    ;
}
;
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
    const propertyModel = createProperty(primaryKey, currentTableModel.Name, null, true);
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
    tableList = {};
    foreignKeyList = [];
    primaryKeyList = [];
    let currentTableModel = null;
    // Parse SQL to objects
    for (let i = 0; i < lines.length; i++) {
        let rowCell = null;
        const tmp = lines[i].trim();
        const propertyRow = tmp.substring(0, 12).toLowerCase().trim();
        if (currentTableModel !== null && tmp.includes(');')) {
            Object.values(tableList).push(currentTableModel);
            currentTableModel = null;
        }
        // Parse Table
        if (propertyRow === 'create table') {
            // Parse row
            let name = tmp.substring(12).trim();
            // Parse Table Name
            name = parseTableName(name);
            // Create Table
            currentTableModel = createTable(name);
        }
        // tmp === 'ALTER TABLE'
        else if (propertyRow == 'alter table') {
            let alterQuerySplit = tmp.toLowerCase().trim();
            let tname = null;
            for (let i = 0; i < Object.values(tableList).length; i++) {
                if (alterQuerySplit.indexOf(tableList[i].Name) !== -1) {
                    tname = tableList[i].Name;
                }
            }
            //check for TableName and following line with constraint bound on database
            if (tname !== null && lines[i + 1] !== null)
                parseAlterTable(tname, lines[i + 1]);
            i += 3;
        }
        // Parse Properties Primarily for field props of Tables
        else if (tmp !== '(' &&
            currentTableModel !== null &&
            propertyRow !== 'alter table ') {
            // Parse the row
            let name = tmp.substring(0, tmp.charAt(tmp.length - 1) === ',' ? tmp.length - 1 : tmp.length);
            // Check if first 10 characters are 'constraint'
            const constraint = name.substring(0, 10).toLowerCase();
            if (constraint === 'constraint') {
                // double checking for constraints here
                if (name.indexOf('PRIMARY KEY') !== -1) {
                    name = name
                        .substring(name.indexOf('PRIMARY KEY'), name.length)
                        .replace(/\"/g, '');
                }
                else if (name.indexOf('FOREIGN KEY') !== -1) {
                    name = name
                        .substring(name.indexOf('FOREIGN KEY'), name.length)
                        .replace(/\"/g, '');
                }
            }
            // Attempt to get the Key Type
            let propertyType = name.substring(0, 11).toLowerCase();
            // Add special constraints
            if (propertyType !== 'primary key' && propertyType !== 'foreign key') {
                if (tmp.indexOf('PRIMARY KEY') !== -1 && tmp.indexOf('FOREIGN KEY') !== -1) {
                    propertyType = 'SQLServer both';
                }
                else if (tmp.indexOf('PRIMARY KEY') !== -1) {
                    propertyType = 'SQLServer primary key';
                }
                else if (tmp.indexOf('FOREIGN KEY') !== -1) {
                    propertyType = 'SQLServer foreign key';
                }
            }
            // Verify if this is a property that doesn't have a relationship (One minute of silence for the property)
            let normalProperty = propertyType !== 'primary key' &&
                propertyType !== 'foreign key' &&
                propertyType !== 'SQLServer primary key' &&
                propertyType !== 'SQLServer foreign key' &&
                propertyType !== 'SQLServer both';
            // Parse properties that don't have relationships
            if (normalProperty) {
                // For now, skip lines with these commands
                if (name.indexOf('ASC') !== -1 ||
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
                    name.indexOf('OIDS') !== -1) {
                    continue;
                }
                // Takes quotation marks out of normal property names
                name = name.replace(/\"/g, '');
                // Create Property
                let propertyModel = createProperty(name, currentTableModel.Name, null, false);
                // Add Property to table
                currentTableModel.Properties.push(propertyModel);
            }
            // Parse Primary Key
            if (propertyType === 'primary key' ||
                propertyType === 'SQLServer primary key' ||
                propertyType === 'SQLServer both') {
                // Parse Primary Key from SQL Server syntax
                if (propertyType === 'SQLServer primary key' ||
                    propertyType === 'SQLServer both') {
                    if (name.indexOf('PRIMARY KEY') !== -1 && name.indexOf('CLUSTERED') === -1) {
                        parseSQLServerPrimaryKey(name, currentTableModel, propertyType);
                    }
                    // Parsing primary key from MySQL syntax
                }
                else if (propertyType === 'primary key') {
                    parseMYSQLPrimaryKey(name, currentTableModel);
                }
            }
            // Parse Foreign Key
            if (propertyType === 'foreign key' ||
                propertyType === 'SQLServer foreign key' ||
                propertyType === 'SQLServer both') {
                // Parse Foreign Key from SQL Server syntax
                if (propertyType === 'SQLServer foreign key' ||
                    propertyType === 'SQLServer both') {
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
    for (let i in tableList) {
        for (let k in tableList[i].Properties) {
            if (tableList[i].Properties[k] !== undefined) {
                let composite = tableList[i].Properties[k].Name.match(/^(\S+)\s(.*)/).slice(1);
                let value = composite[1].search(/NOT/i);
                if (value > 0) {
                    let type = composite[1].substring(0, value - 1);
                    let additional_constraints = composite[1].substring(value);
                    tableList[i].Properties[k].field_name = composite[0];
                    tableList[i].Properties[k].data_type = type;
                    tableList[i].Properties[k].additional_constraints = additional_constraints;
                }
                else {
                    let type = composite[1].substring(value);
                    let additional_constraints = null;
                    tableList[i].Properties[k].field_name = composite[0];
                    tableList[i].Properties[k].data_type = type;
                    tableList[i].Properties[k].additional_constraints = additional_constraints;
                }
            }
        }
    }
    return objSchema(Object.values(tableList));
}
exports.default = parseSql;
/*  Function
      Section   */
function createTableUI() {
    Object.values(tableList).forEach(function (tableModel) {
        // Push in string code to d3tables array to render table name as a row
        for (let ref in tableModel.Properties)
            ;
    });
    return tableList;
}
// functions to handle mouseover to depict related tables only
// Adding Primary Key and Foreign Key designations for table columns
function checkSpecialKey(propertyModel) {
    if (propertyModel.IsForeignKey && propertyModel.IsPrimaryKey) {
        return 'PK | FK';
    }
    else if (propertyModel.IsForeignKey) {
        return 'FK';
    }
    else if (propertyModel.IsPrimaryKey) {
        return 'PK';
    }
    else {
        return '';
    }
}
//# sourceMappingURL=parse.js.map