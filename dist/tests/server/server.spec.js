"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//// Run your application first to test server
const supertest_1 = __importDefault(require("supertest"));
const swapiSchema_1 = require("./utils/swapiSchema");
const mysqlSchema_1 = __importDefault(require("./utils/mysqlSchema"));
const dotenv_1 = __importDefault(require("dotenv"));
const chance_1 = __importDefault(require("chance"));
dotenv_1.default.config();
const chance = new chance_1.default();
const server = 'http://localhost:3000';
const { TEST_USER_EMAIL, TEST_USER_PW, PG_TEST_URL, PG_TEST_USERNAME, PG_TEST_PW, MYSQL_TEST_URL, MYSQL_TEST_USERNAME, MYSQL_TEST_PW, } = process.env;
describe('Server Health', () => {
    it('is running as expected', async () => {
        const response = await (0, supertest_1.default)(server).get('/api/healthcheck');
        expect(response.statusCode).toBe(200);
    });
    it('has access to environment variables', () => {
        expect(PG_TEST_URL).toBeDefined();
        expect(PG_TEST_USERNAME).toBeDefined();
        expect(PG_TEST_PW).toBeDefined();
        expect(MYSQL_TEST_URL).toBeDefined();
        expect(MYSQL_TEST_USERNAME).toBeDefined();
        expect(MYSQL_TEST_PW).toBeDefined();
        expect(TEST_USER_EMAIL).toBeDefined();
        expect(TEST_USER_PW).toBeDefined();
    });
});
describe('/api/userRegistration', () => {
    const testRegistration = {
        email: chance.email(),
        full_name: 'John Doe',
        password: 'ValidPassword123',
    };
    it('responds with 200 for successful registration', async () => {
        const response = await (0, supertest_1.default)(server)
            .post('/api/userRegistration')
            .send(testRegistration);
        expect(response.status).toBe(200);
    });
    it('responds with 403 and error message for duplicate emails', async () => {
        const response = await (0, supertest_1.default)(server)
            .post('/api/userRegistration')
            .send(testRegistration);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ err: 'Email already in use' });
    });
    it('responds with 400 and error message for non-string data', async () => {
        const response = await (0, supertest_1.default)(server)
            .post('/api/userRegistration')
            .send({
            ...testRegistration,
            email: 12345,
        });
        expect(response.status).toBe(400);
        expect(response.body).toBe('err: User data must be strings');
    });
});
xdescribe('/api/verifyUser', () => {
    it('responds with 200, content-type JSON, and correct body', async () => {
        const response = await (0, supertest_1.default)(server).post('/api/verifyUser').send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PW,
        });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        const { id, email, full_name, picture } = response.body;
        const assertionBody = { id, email, full_name, picture };
        expect(assertionBody).toEqual({
            id: 6,
            email: TEST_USER_EMAIL,
            full_name: 'TestFirst TestLast',
            picture: null,
        });
        expect(typeof response.body.password).toBe('string');
    });
    it('responds with 400 and error message for non-string data', async () => {
        const response = await (0, supertest_1.default)(server).post('/api/verifyUser').send({
            email: TEST_USER_EMAIL,
            password: 12345,
        });
        expect(response.status).toBe(400);
        expect(response.body).toBe('err: User data must be strings');
    });
    it('responds with 401 for incorrect password', async () => {
        const response = await (0, supertest_1.default)(server).post('/api/verifyUser').send({
            email: TEST_USER_EMAIL,
            password: '12345',
        });
        expect(response.status).toBe(401);
    });
});
describe('/api/saveSchema', () => {
    it('responds with 200', async () => {
        const response = await (0, supertest_1.default)(server).post('/api/saveSchema').send({
            email: TEST_USER_EMAIL,
            schema: swapiSchema_1.swapiString,
        });
        expect(response.status).toBe(200);
    });
    it('responds with 400 and error message for non-string data', async () => {
        const response = await (0, supertest_1.default)(server).post('/api/saveSchema').send({
            email: TEST_USER_EMAIL,
            schema: swapiSchema_1.swapiSchema,
        });
        expect(response.status).toBe(400);
        expect(response.body).toBe('err: User data must be strings');
    });
});
xdescribe('/api/retrieveSchema', () => {
    it('responds with 200, content-type JSON, and correct body', async () => {
        const response = await (0, supertest_1.default)(server).get(`/api/retrieveSchema/${TEST_USER_EMAIL}`);
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toMatch(/json/);
        expect(response.body).toEqual(swapiSchema_1.swapiString);
    });
    it('responds with 204 if user has no saved schema', async () => {
        const response = await (0, supertest_1.default)(server).get(`/api/retrieveSchema/no_database@email.com`);
        expect(response.status).toBe(204);
    });
});
xdescribe('/api/sql/postgres/schema', () => {
    const pgDB = {
        db_type: 'postgres',
        database_link: PG_TEST_URL,
        hostname: 'heffalump.db.elephantsql.com',
        username: PG_TEST_USERNAME,
        password: PG_TEST_PW,
        port: '5432',
        database_name: 'xkpuafao',
    }; // SWAPI
    it('responds with 200, content-type JSON, and correct body', async () => {
        const response = await (0, supertest_1.default)(server).get(`/api/sql/postgres/schema`).query(pgDB);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(swapiSchema_1.swapiSchema);
    });
});
xdescribe('/api/sql/mysql/schema', () => {
    const mysqlDB = {
        db_type: 'mysql',
        database_link: MYSQL_TEST_URL,
        hostname: 'us-east.connect.psdb.cloud',
        username: MYSQL_TEST_USERNAME,
        password: MYSQL_TEST_PW,
        port: '3306',
        database_name: 'dbspytest',
    }; // Test DB
    it('responds with 200, content-type JSON, and correct body', async () => {
        const response = await (0, supertest_1.default)(server).get(`/api/sql/mysql/schema`).query(mysqlDB);
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(mysqlSchema_1.default);
    }, 15 * 1000 // 15 second timeout is more than enough
    );
});
//# sourceMappingURL=server.spec.js.map