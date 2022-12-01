import parseSql from '../../src/parse'


describe('Parsing SQL Text Data', () => {
  const testTableQuery = `
      CREATE TABLE accounts (
      user_id serial PRIMARY KEY,
      username VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 50 ) NOT NULL,
      email VARCHAR ( 255 ) UNIQUE NOT NULL,
      created_on TIMESTAMP NOT NULL,
      last_login TIMESTAMP );
      
      CREATE TABLE accounts2 (
        user_id serial PRIMARY KEY,
        username VARCHAR ( 50 ) UNIQUE NOT NULL,
        password VARCHAR ( 50 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        created_on TIMESTAMP NOT NULL,
        last_login TIMESTAMP );
      `
  let test = parseSql(testTableQuery);

  afterAll(() => {
    test = '';
  })

  it('should have proper number of tables', () => {
    const tables = testTableQuery.match(/CREATE TABLE/g);
    const parsedTables = Object.keys(test).length;
    expect(parsedTables).toEqual(tables.length)
  })

  xit('should have proper number of columns per table', () => {

  })

  it('should properly identify PK', () => {
    const pkCount = testTableQuery.match(/PRIMARY KEY/g);
    const fkCount = testTableQuery.match(/FOREIGN KEY/g);
    
    const parsedKeys = Object.values(test).reduce((count, table) => {
      Object.values(table).forEach(column => {
        if (column.isPrimaryKey) count.pk += 1;
        if (column.isForeignKey) count.fk += 1;
      })
      return count;
    }, { pk: 0, fk: 0 })

    expect(parsedKeys.pk).toEqual(pkCount);
    expect(parsedKeys.fk).toEqual(fkCount);
  })
})