import queryGen from "../src/queryGen";
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
  References: [Reference],
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

const schema: SchemaObject = {
  'testTable': {
    'testTable': {
      Name: 'testColumn',
      Value: 10,
      TableName: 'testTable',
      References: [{
        PrimaryKeyName: "",
        ReferencesPropertyName: "",
        PrimaryKeyTableName: "",
        ReferencesTableName: "",
        IsDestination: false,
        constrainName: ""
      }],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: "uhhh",
      data_type: 'BigInt',
      additional_constraints: ""
    }
  }
}

describe('QueryGen...', () => {
  const output: any = queryGen(schema);
  console.log(output);
  it('should output an object of arrays containing a create table query', () => {
    expect(output[0][0]).toContain('CREATE TABLE "public"."testTable"');
  })
  it('should output column details create table queries', () => {
    expect(output[0][0]).toContain('"uhhh" BigInt');
  })
})