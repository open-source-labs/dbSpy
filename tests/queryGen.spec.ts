import queryGen from "../src/queryGen";
interface Reference {
  PrimaryKeyName: string,
  ReferencesPropertyName: string,
  PrimaryKeyTableName: string,
  ReferencesTableName: string,
  IsDestination: boolean,
  constraintName: string
}

interface Column {
  Name: string,
  Value: any,
  TableName: string,
  References: [Reference],
  IsPrimaryKey: string,
  IsForeignKey: string,
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
        constraintName: ""
      }],
      IsPrimaryKey: 'true',
      IsForeignKey: 'false',
      field_name: "uhhh",
      data_type: 'BigInt',
      additional_constraints: ""
    },
    'testTable2': {
      Name: 'testColumn2',
      Value: 11,
      TableName: 'testTable2',
      References: [{
        PrimaryKeyName: "",
        ReferencesPropertyName: "",
        PrimaryKeyTableName: "",
        ReferencesTableName: "",
        IsDestination: false,
        constraintName: ""
      }],
      IsPrimaryKey: 'false',
      IsForeignKey: 'true',
      field_name: "uhhh",
      data_type: 'BigInt',
      additional_constraints: ""
    }
  }
}

describe('QueryGen...', () => {
  // CREATE TABLE "test" ( "testrow" serial NOT NULL PRIMARY KEY );
  const output: any = queryGen(schema);
  console.log(output);
  it('should output an object of arrays containing a create table query', () => {
    expect(output.create[0]).toContain('CREATE TABLE "public"."testTable"');
  })
  it('should output column details create table queries', () => {
    expect(output.create[0]).toContain('"uhhh" BigInt');
  })
  it('should add PRIMARY KEY constraint', () => {
    expect(output.create[0]).toContain('PRIMARY KEY');
  })
  it('should add alter table query when foreign key exists', () => {
    expect(output.alter[0]).toContain('ALTER TABLE');
  })
})