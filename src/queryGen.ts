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
//                constrainName: string
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

import { SchemaObject, Column } from "./components/DBDisplay/Types";

export default function queryGen(schemaObj: SchemaObject) {
  const createTableQs : Array<string> = [];
  const alterTableQs : Array<string> = [];
  // go through object keys as table names
  for (const key in schemaObj){
    // initialize create table string with table name: 'CREATE TABLE [tablename] ( /n'
    let createTableString: string = `CREATE TABLE "public"."${key}" ( `;
    const table = schemaObj[key]
    // go through columns in key (table)
    for (const column in table){
      // grabbing column items...
      const { TableName, data_type, References, IsPrimaryKey, IsForeignKey, field_name, additional_constraints }: Column = table[column];
      // append column configs to create-table string: '[name] [type] [constraints {NOT NULL, UNIQUE, PK, FK, etc}], /n'
      // currently, constraints only ever contains a single string - would be great for the app to allow for more
      // does data_type need handling?
      let constraintList: string = `${additional_constraints}`;
      // handle primary key string:
      console.log(IsPrimaryKey === 'true');
      if (IsPrimaryKey === 'true' ){
        console.log(constraintList, "line 76");
        constraintList += (' PRIMARY KEY');
      }
      const columnString: string = `"${field_name}" ${data_type} ${constraintList}, `
      createTableString += (columnString);

      ///////////////////// ALTER TABLE QUERIES /////////////////////////////
      // if constraint pertains to a foreign key reference, build alterTableQ
      // access stuff on Reference to tell us what's up
      const ref = References[0]
      // `ALTER TABLE ${TableName} ADD CONSTRAINT fk${References{constrainName}} FOREIGN KEY (${field_name}) REFERENCES ${References{ReferencesTableName}}(${References{ReferencesPropertyName}})`
      if (IsForeignKey === 'true'){
        const alterTableString: string = `ALTER TABLE ${TableName} ADD CONSTRAINT fk_${ref['constrainName']} FOREIGN KEY (${field_name}) REFERENCES ${ref['ReferencesTableName']}(${ref['ReferencesPropertyName']}) ON UPDATE SET NULL ON DELETE SET NULL `
        alterTableQs.push(alterTableString);
      }
    }
    // remove extra comma at the end of column declarations to avoid sql errors
    if(createTableString[createTableString.length - 2] === ',') {
      createTableString = createTableString.slice(0, -2);
    }
    // at the end of iteration concat ');' and you're done
    createTableString+= (" );");
    createTableQs.push(createTableString);

  }
  return { create: createTableQs, alter: alterTableQs };

}
