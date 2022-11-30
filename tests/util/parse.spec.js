import parseSql from '../../src/parse'
import fs from 'fs';
import path from 'path';

describe('Parsing SQL Text Data', () => {
  const testTableQuery = `
      CREATE TABLE accounts (
      user_id serial PRIMARY KEY,
      username VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 50 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL,
      created_on TIMESTAMP NOT NULL,
      last_login TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES accounts2(user_id)
      );
      
      CREATE TABLE accounts2 (
        user_id serial PRIMARY KEY,
        username VARCHAR ( 50 ) UNIQUE NOT NULL,
        password VARCHAR ( 50 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP
        );
      `;

  const testFile = fs.readFileSync(path.join(__dirname, 'test_db.sql')).toString();
  // console.log(testFile);

  let test = parseSql(testTableQuery);
  console.log(test);
  it('should have proper number of tables', () => {
    const tables = testTableQuery.match(/CREATE TABLE/g);
    const parsedTables = Object.keys(test).length;
    expect(parsedTables).toBe(tables.length)
  })

  it('should have proper number of columns per table', () => {
    const tableColumns = Object.keys(test.accounts).length;
    expect(tableColumns).toBe(6)
  })

  it('should properly identify PK', () => {
    const pkCount = testTableQuery.match(/PRIMARY KEY/g).length;
    const parsedKeys = Object.values(test).reduce((pk, table) => {
      Object.values(table).forEach(column => {
        if (column.IsPrimaryKey) pk += 1;
      })
      return pk;
    }, 0)

    expect(parsedKeys).toBe(pkCount);
  })

  it('should properly identify FK', () => {
    
  })
})