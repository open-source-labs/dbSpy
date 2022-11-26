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

interface Reference {
  PrimaryKeyName: string,
  ReferencesPropertyName: string,
  PrimaryKeyTableName: string,
  ReferencesTableName: string,
  IsDestination: boolean,
  constrainName: string
}

interface Column {
  Name: string,
  Value: any,
  TableName: string,
  References: Reference[], // an array of objects typed as Reference interface
  IsPrimaryKey: boolean,
  IsForeignKey: boolean,
  field_name: string,
  data_type: string,
  additional_constraints: string
}

interface Table {
  [key: string]: Column;
}

interface SchemaObject {
  [key: string]: Table;
}

export default function queryGen(schemaObj: SchemaObject) {
  const createTableQs : Array<string> = [];
  const alterTableQs : Array<string> = [];
  // go through object keys as table names
  for (const key in schemaObj){
    // initialize create table string with table name: 'CREATE TABLE [tablename] ( /n'
    let createTableString: string = `CREATE TABLE "public"."${key}" ( /n`;
    const table = schemaObj[key]
    // go through columns in key (table)
    for (const column in table){
      // grabbing column items...
      const { TableName, data_type, References, IsPrimaryKey, IsForeignKey, field_name, additional_constraints }: Column = table[column];
      // append column configs to create-table string: '[name] [type] [constraints {NOT NULL, UNIQUE, PK, FK, etc}], /n'
      // currently, constraints only ever contains a single string - would be great for the app to allow for more
      // does data_type need handling?
      const constraintList: string = additional_constraints;
      // handle primary key string:
      if (IsPrimaryKey) constraintList.concat(' PRIMARY KEY');
      const columnString: string = `"${field_name}" ${data_type} ${constraintList}, \n`
      createTableString += (columnString);

      ///////////////////// ALTER TABLE QUERIES /////////////////////////////
      // if constraint pertains to a foreign key reference, build alterTableQ
      // access stuff on Reference to tell us what's up
      const ref = References[0]
      // `ALTER TABLE ${TableName} ADD CONSTRAINT fk${References{constrainName}} FOREIGN KEY (${field_name}) REFERENCES ${References{ReferencesTableName}}(${References{ReferencesPropertyName}})`
      if (IsForeignKey){
        const alterTableString: string = `ALTER TABLE ${TableName} ADD CONSTRAINT fk_${ref['constrainName']} FOREIGN KEY (${field_name}) REFERENCES ${ref['ReferencesTableName']}(${ref['ReferencesPropertyName']})`
        alterTableQs.push(alterTableString);
      }
    }
    // at the end of iteration concat ');' and you're done
    createTableString+= (" );");
    createTableQs.push(createTableString);

  }
  return [createTableQs, alterTableQs];

}
