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

xdescribe('Account Registration', () => {
  const testRegistration = {
    email: 'JohnDoe123@gmail.com',
    full_name: 'John Doe',
    password: 'testPassword123',
  };

  afterAll(() => {
    // TODO: Add mock database to test in?
    // Delete the test account from database
  });

  it('returns 200 when called', async () => {
    const response = await request(server)
      .post('/api/userRegistration')
      .send(testRegistration);
    expect(response.status).toBe(200);
  });
  it('checks for duplicate emails', async () => {
    const duplicateRes = await request(server)
      .post('/api/userRegistration')
      .send({ email: 'alexandertu95@gmail.com' });
    expect(duplicateRes.status).toBe(403);
  });
});

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
      it('has access to environment variables', () => {
        expect(PG_TEST_URL).toBeDefined();
        expect(PG_TEST_USERNAME).toBeDefined();
        expect(PG_TEST_PW).toBeDefined();
      });

      it('responds with 200, content-type json, and correct body', async () => {
        const response = await request(server)
          .get(`/api/sql/postgres/schema`)
          .query(pgDB);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(swapiSchema);
      });
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
      it('has access to environment variables', () => {
        expect(MYSQL_TEST_URL).toBeDefined();
        expect(MYSQL_TEST_USERNAME).toBeDefined();
        expect(MYSQL_TEST_PW).toBeDefined();
      });

      it(
        'responds with 200, content-type JSON, and correct body',
        async () => {
          const response = await request(server)
            .get(`/api/sql/mysql/schema`)
            .query(mysqlDB);
          expect(response.status).toEqual(200);
          expect(response.headers['content-type']).toMatch(/json/);
          expect(response.body).toEqual(mysqlSchema);
        },
        15 * 1000 // 15 second timeout is more than enough
      );
    });
  });
});
