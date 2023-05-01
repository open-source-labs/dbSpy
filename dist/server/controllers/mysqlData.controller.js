"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objSchema = exports.getSchema = void 0;
const fs_1 = __importDefault(require("fs"));
const index_1 = __importDefault(require("../logger/index"));
const mysqldump = require('mysqldump');
const dotenv = require('dotenv');
dotenv.config();
const mySQLdataController = {};
// SSL data stored as environment variable for GitHub Actions access
// Also stored in .cert file because Elastic Beanstalk has a ~4000 char limit for its environment variables
const SSL_KEY = typeof process.env.SSL_KEY === 'string'
    ? Buffer.from(process.env.SSL_KEY, 'base64').toString('ascii')
    : fs_1.default.readFileSync('./.cert/key.pem').toString();
const SSL_CERT = typeof process.env.SSL_CERT === 'string'
    ? Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii')
    : fs_1.default.readFileSync('./.cert/cert.pem').toString();
/**
 * mySQLdataController.getSchema
 * @param {string} hostname - A required string with database hostname
 * @param {string} password - A required string with database password
 * @param {string} port - A required string with database port
 * @param {string} username - A required string with database username
 * @param {string} databaseName - A required string with the database name
 **/
const getSchema = async (req, res, next) => {
    // // Option 1 - Production
    //use mysqldump to download mysql db schema
    index_1.default.info('Connecting to mySQL database...');
    const { hostname, password, port, username, database_name } = req.query;
    try {
        const result = await mysqldump({
            connection: {
                host: hostname,
                password,
                port,
                user: username,
                database: database_name,
                ssl: {
                    key: SSL_KEY,
                    cert: SSL_CERT,
                },
            },
            dumpToFile: '../db_schemas',
        });
        res.locals.data = result;
        //const { tables } = result;
        next();
    }
    catch (error) {
        index_1.default.info(error.message);
        next({ message: 'Error with getSchema middleware' });
    }
};
exports.getSchema = getSchema;
/**
 * mySQLdataController.objSchema
 * Iterates through data tables received from mySQL server
 * Builds object to be returned to front-end
 */
const objSchema = (_req, res, next) => {
    const db = res.locals.data;
    const { tables } = db;
    const results = {};
    //create Table class
    class TableModel {
        constructor(name) {
            this.name = name;
        }
    }
    //create Properties class
    class PropertyModel {
        constructor(name) {
            this.Value = null;
            this.data_type = 'varchar';
            this.TableName = null;
            this.References = [];
            this.IsPrimaryKey = false;
            this.IsForeignKey = false;
            this.additional_constraints = 'NA';
            this.Name = name;
            this.field_name = name;
        }
    }
    // create foreign key class
    class ForeignKeyModel {
        constructor() {
            this.PrimaryKeyName = null; //key name at referenced table
            this.PrimaryKeyTableName = null; //  referenced table name
            this.ReferencesPropertyName = null; //key name at current table
            this.ReferencesTableName = null; //current table name
            this.IsDestination = false;
            this.constraintName = null; //constraint from SQL query
        }
    }
    //append tables and table properties to results
    tables.forEach((table) => {
        //check if table or view
        if (!table.isView) {
            //get unique keys
            let uKeys = table.schema.slice(table.schema.indexOf('UNIQUE KEY'));
            uKeys = uKeys.slice(uKeys.indexOf('(') + 1, uKeys.indexOf(')'));
            if (uKeys.includes(','))
                uKeys = uKeys.split(', ');
            else
                uKeys = [uKeys];
            const uniqueKeys = uKeys.map((key) => key.slice(1, -1));
            //get primary keys
            let pKeys = table.schema.slice(table.schema.indexOf('PRIMARY KEY'));
            pKeys = pKeys.slice(pKeys.indexOf('(') + 1, pKeys.indexOf(')'));
            if (pKeys.includes(','))
                pKeys = pKeys.split(', ');
            else
                pKeys = [pKeys];
            const primaryKeys = pKeys.map((key) => key.slice(1, -1));
            //create foreign key and reference object (foreign key: references)
            const foreignKeyReferences = {};
            const foreignKeys = function (string = '') {
                if (string === '')
                    return;
                let constraint = null;
                //find constraint name
                if (string.slice(string.indexOf('CONSTRAINT'))) {
                    string = string.slice(string.indexOf('CONSTRAINT'));
                    string = string.slice(string.indexOf('`') + 1);
                    constraint = string.slice(0, string.indexOf('`'));
                }
                //find foreign key
                string = string.slice(string.indexOf('FOREIGN KEY'));
                string = string.slice(string.indexOf('(') + 2);
                const fKey = string.slice(0, string.indexOf(')') - 1);
                //find primary table name
                string = string.slice(string.indexOf('REFERENCES'));
                string = string.slice(string.indexOf('`') + 1);
                const primaryTable = string.slice(0, string.indexOf('`'));
                //find primary table name
                const primaryKey = string.slice(string.indexOf('(') + 2, string.indexOf(')') - 1);
                //create new ForeignKeyModel and assign properties
                foreignKeyReferences[fKey] = new ForeignKeyModel();
                foreignKeyReferences[fKey].ReferencesPropertyName = fKey;
                foreignKeyReferences[fKey].ReferencesTableName = table.name;
                foreignKeyReferences[fKey].PrimaryKeyName = primaryKey;
                foreignKeyReferences[fKey].PrimaryKeyTableName = primaryTable;
                foreignKeyReferences[fKey].constraintName = constraint;
                //find additional foreign keys and references
                return foreignKeys(string);
            };
            //invoke foreignKeys function and pass table.schema string
            foreignKeys(table.schema);
            //create and assign new table to results object
            //const results: { [key: string]: TableModel } = {}; ---> We Don't need this? -Stephen
            //create new table properties
            table.columnsOrdered.forEach((propName) => {
                const newProp = new PropertyModel(propName);
                //assign table name
                newProp.TableName = table.name;
                //assign field name
                newProp.field_name = newProp.Name;
                //assign data type
                newProp.data_type = table.columns[newProp.Name].type;
                //assign additional_constraints (primary, unique or not null)
                if (primaryKeys.includes(newProp.Name))
                    newProp.additional_constraints = 'PRIMARY KEY';
                else if (uniqueKeys.includes(newProp.Name))
                    newProp.additional_constraints = 'UNIQUE';
                else if (!table.columns[propName].nullable)
                    newProp.additional_constraints = 'NOT NULL';
                //check if primary key
                if (primaryKeys.includes(newProp.Name))
                    newProp.IsPrimaryKey = true;
                // check if foreign key and assign references
                if (foreignKeyReferences[newProp.Name]) {
                    newProp.IsForeignKey = true;
                    newProp.References = [foreignKeyReferences[newProp.Name]];
                }
                //assign new property to table
                const results = {};
                if (!results[table.name]) {
                    results[table.name] = new TableModel(table.name);
                }
                results[table.name][newProp.Name] = newProp;
            });
        }
    });
    res.locals.data = results;
    return next();
};
exports.objSchema = objSchema;
exports.default = mySQLdataController;
//# sourceMappingURL=mysqlData.controller.js.map