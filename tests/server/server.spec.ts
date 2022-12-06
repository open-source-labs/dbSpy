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
  const testRegistration = {
    email: 'JohnDoe123@gmail.com', 
    full_name: 'John Doe', 
    password: 'testPassword123'
  }

  afterAll(() => {
    // TODO: Add mock database to test in?
    // Delete the test account from database
  })
  
  it('returns 200 when called', async () => {
    const response = await request(server).post('/api/userRegistration').send(testRegistration);
    expect(response.status).toBe(200);
  })
  it('checks for duplicate emails', async () => {
    const duplicateRes = await request(server).post('/api/userRegistration').send({email: 'alexandertu95@gmail.com'})
    expect(duplicateRes.status).toBe(403);
  })
  it('')
})

