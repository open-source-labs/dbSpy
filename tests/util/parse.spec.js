import parseSql from '../../src/parse'
import fs from 'fs';
import path from 'path';

describe('Parsing SQL Text Data', () => {
  const testTableQuery = `
      CREATE TABLE accounts (
      user_id integer PRIMARY KEY,
      username VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 50 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL,
      created_on TIMESTAMP NOT NULL,
      last_login TIMESTAMP,
      );
      
      CREATE TABLE accounts2 (
        user_id integer PRIMARY KEY,
        username VARCHAR ( 50 ) UNIQUE NOT NULL,
        password VARCHAR ( 50 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP
        );
      `;

  // Current query test with no foreign key relations
  let test_db = parseSql(testTableQuery);
  
  it('should have proper number of tables', () => {
    const tables = testTableQuery.match(/CREATE TABLE/g);
    const parsedTables = Object.keys(test_db).length;
    expect(parsedTables).toBe(tables.length)
  })

  // Currently hard coded
  it('should have proper number of columns per table', () => {
    const tableColumns = Object.keys(test_db.accounts).length;
    expect(tableColumns).toBe(6);
  })

  it('should properly identify PK', () => {
    const pkCount = testTableQuery.match(/PRIMARY KEY/g).length;
    const parsedKeys = Object.values(test_db).reduce((pk, table) => {
      Object.values(table).forEach(column => {
        if (column.IsPrimaryKey) pk += 1;
      })
      return pk;
    }, 0)

    expect(parsedKeys).toBe(pkCount);
  })

  xit('should properly identify FK', () => {})
})

describe('Parsing PostgreSQL query', () => {
  // Postgres test file
  const postgres_testDB = fs.readFileSync(path.join(__dirname, 'test_postgresDB.sql')).toString();
  let test_postgres_testDB = parseSql(postgres_testDB);
  
  it('should have proper number of tables', () => {
    const tables = postgres_testDB.match(/CREATE TABLE/g);
    const parsedTables = Object.keys(test_postgres_testDB).length;
    expect(parsedTables).toBe(tables.length)
  })

  // Currently hard coded
  it('should have proper number of columns per table', () => {
    const tableColumns = Object.keys(test_postgres_testDB["public.projects"]).length;
    expect(tableColumns).toBe(5)
  })

  it('should properly identify PK', () => {
    const pkCount = postgres_testDB.match(/PRIMARY KEY/g).length;
    const parsedKeys = Object.values(test_postgres_testDB).reduce((pk, table) => {
      Object.values(table).forEach(column => {
        if (column.IsPrimaryKey) pk += 1;
      })
      return pk;
    }, 0)

    expect(parsedKeys).toBe(pkCount);
  })

  xit('should properly identify FK', () => {
    
  })
})

xdescribe('Parsing MySQL query', () => {
  // MySQL is currently running into parsing errors when adding foreign keys/alter table queries
  // const mySQL_testDB = fs.readFileSync(path.join(__dirname, 'test_mysqlDB.sql')).toString();
  // let test_var = parseSql(testTableQuery);
})