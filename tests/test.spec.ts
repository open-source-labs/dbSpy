import request from 'supertest';
import express from 'express'
import { postgresRouter } from '../server/routes/postgres.router'
import dotenv from 'dotenv';
import routes from '../server/routes'

describe('does stuff', () => {
  it('runs tests', () => {
    expect(true).toEqual(true);

  })
})

dotenv.config()

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.listen(3000, () => {
    routes(app);
})
describe('touches the server', () => {
  beforeEach(() => {
  });

  it('sends a request successfully', async() => {
    const response = await request(app).get('/api/healthcheck');
    expect(response.statusCode).toBe(200);
  })


})

