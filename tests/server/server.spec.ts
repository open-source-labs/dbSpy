//// Run your application first to test server
import request from 'supertest';
import swapiSchema from './utils/swapiSchema';
import mysqlSchema from './utils/mysqlSchema';
import dotenv from 'dotenv';
dotenv.config();

const server = 'http://localhost:3000';

describe('Server Health', () => {
  it('server is running as expected', async () => {
    const response = await request(server).get('/api/healthcheck');
    expect(response.statusCode).toBe(200);
  });
});
describe('Account Registration', () => {
  const testRegistration = {
    email: 'JohnDoe123@gmail.com',
    full_name: 'John Doe',
    password: 'testPassword123',
  };

  afterAll(() => {
    // TODO: Add mock database to test in?
    // Delete the test account from database
  });

  xit('returns 200 when called', async () => {
    const response = await request(server)
      .post('/api/userRegistration')
      .send(testRegistration);
    expect(response.status).toBe(200);
  });
  xit('checks for duplicate emails', async () => {
    const duplicateRes = await request(server)
      .post('/api/userRegistration')
      .send({ email: 'alexandertu95@gmail.com' });
    expect(duplicateRes.status).toBe(403);
  });
});

/**
 * Integration tests for remote SQL databases
 *
 * Goals:
 * - Connect to remote database endpoint
 * - Check response status code
 * - Check type of response if applicable
 * - Console.log response, copy paste as expected body data
 */

describe('/api/sql/postgres', () => {
  const { PG_TEST_URL, PG_TEST_USERNAME, PG_TEST_PW } = process.env;

  const pgDB = {
    db_type: 'postgres',
    database_link: PG_TEST_URL,
    hostname: 'heffalump.db.elephantsql.com',
    username: PG_TEST_USERNAME,
    password: PG_TEST_PW,
    port: '5432',
    database_name: 'xkpuafao',
  }; // SWAPI

  describe('/schema', () => {
    describe('GET', () => {
      it('responds with 200, content-type json, and correct body', async () => {
        const response = await request(server)
          .get(`/api/sql/postgres/schema`)
          .query(pgDB);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        // for (const tableKey in response.body) {
        //   const table = response.body[tableKey];
        //   for (const column in table) {
        //     console.log({ tableKey, column }, table[column].References);
        //   }
        // }
        expect(response.body).toEqual(swapiSchema);
      }, 180000);
    });
  });
});

describe('/api/sql/mysql', () => {
  const { MYSQL_TEST_URL, MYSQL_TEST_USERNAME, MYSQL_TEST_PW } = process.env;
  const mysqlDB = {
    db_type: 'mysql',
    database_link: MYSQL_TEST_URL,
    hostname: 'us-east.connect.psdb.cloud',
    username: MYSQL_TEST_USERNAME,
    password: MYSQL_TEST_PW,
    port: '3306',
    database_name: 'dbspytest',
  }; // Test DB

  describe('/schema', () => {
    describe('GET', () => {
      it('responds with 200 and content-type X', async () => {
        const response = await request(server)
          .get(`/api/sql/mysql/schema`)
          .query(mysqlDB);
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(mysqlSchema);
      });
    });
  });
});
