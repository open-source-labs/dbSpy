"use strict";
// Here is the shape of the object in the store
//     {
//       [table]: {
//         [column name]: {
//            Name: string,
//            Value: any,
//            TableName: string,
//            References: [
//              {
//                PrimaryKeyName: string,
//                ReferencesPropertyName: string,
//                PrimaryKeyTableName: string,
//                ReferencesTableName: string,
//                IsDestination: boolean,
//                constraintName: string
//              }
//            ],
//            IsPrimaryKey: boolean,
//            IsForeignKey: boolean,
//            field_name: string,
//            data_type: string,
//            additional_constraints: string
//          }
//       }
//    }
// row.TableName - row.field_name - IsPrimaryKey
Object.defineProperty(exports, "__esModule", { value: true });
function queryGen(schemaObj, system) {
    const createTableQs = [];
    const alterTableQs = [];
    // go through object keys as table names
    for (const key in schemaObj) {
        // initialize create table string with table name: 'CREATE TABLE [tablename] ( /n'
        let createTableString = `CREATE TABLE ${key} ( `;
        const table = schemaObj[key];
        // go through columns in key (table)
        for (const column in table) {
            // grabbing column items...
            let { TableName, data_type, References, IsPrimaryKey, IsForeignKey, field_name, additional_constraints, Value, } = table[column];
            // append column configs to create-table string: '[name] [type] [constraints {NOT NULL, UNIQUE, PK, FK, etc}], /n'
            // currently, constraints only ever contains a single string - would be great for the app to allow for more
            // does data_type need handling?
            let constraintList = `${additional_constraints}`;
            // handle primary key string:
            if (IsPrimaryKey === true) {
                constraintList += ' PRIMARY KEY';
            }
            // handle default values:
            if (Value !== null) {
                constraintList += ` default ${Value}`;
            }
            // handle SERIAL vs AUTO_INCREMENT datatype based on chosen system
            if (data_type === 'AUTO_INCREMENT') {
                if (system === 'PostgreSQL') {
                    data_type = 'SERIAL';
                }
                else
                    data_type = 'AUTO_INCREMENT';
            }
            const columnString = `"${field_name}" ${data_type} ${constraintList}, `;
            createTableString += columnString;
            ///////////////////// ALTER TABLE QUERIES /////////////////////////////
            // if constraint pertains to a foreign key reference, build alterTableQ
            // access stuff on Reference to tell us what's up
            const ref = References[0];
            // `ALTER TABLE ${TableName} ADD CONSTRAINT fk${References{constraintName}} FOREIGN KEY (${field_name}) REFERENCES ${References{ReferencesTableName}}(${References{ReferencesPropertyName}})`
            if (IsForeignKey === true) {
                const alterTableString = `ALTER TABLE ${TableName} ADD CONSTRAINT ${ref['constraintName']} FOREIGN KEY (${field_name}) REFERENCES ${ref['ReferencesTableName']}(${ref['ReferencesPropertyName']}) ON UPDATE SET NULL ON DELETE SET NULL `;
                alterTableQs.push(alterTableString);
            }
        }
        // remove extra comma at the end of column declarations to avoid sql errors
        if (createTableString[createTableString.length - 2] === ',') {
            createTableString = createTableString.slice(0, -2);
        }
        // at the end of iteration concat ');' and you're done
        createTableString += ' ); ';
        createTableQs.push(createTableString);
    }
    return { create: createTableQs, alter: alterTableQs };
}
exports.default = queryGen;
//# sourceMappingURL=queryGen.js.map