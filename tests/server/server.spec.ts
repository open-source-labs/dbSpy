//// Run your application first to test server
import request from 'supertest';
const server = 'http://localhost:3000'

describe('Server Health', () => {
  it('server is running as expected', async () => {
    const response = await request(server).get('/api/healthcheck');
    expect(response.statusCode).toBe(200);
  })
})
describe('Account Registration', () => {
  it('returns 200 when called', async () => {
    const response = await request(server).post('/api/userRegistration').send({name: 'John Doe', password: 'testPassword123'})

    expect(response.status).toBe(200);
  
  })
})