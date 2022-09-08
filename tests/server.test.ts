/*  */
const request = require('supertest');
// const {describe, expect, it} = require ('@jest/globals');
const app = require("../server/server")
const server = 'http://localhost:3000';

/**
 * Read the docs! https://www.npmjs.com/package/supertest
 */

// describe('Route integration', () => {
//   describe('/', () => {
//     describe('GET', () => {
//       it('responds with 200 status and text/html content type', async () =>
//         await request(server)
//           .get('/')
//           // .then(res => {
//           //   console.log('this is res', res)
//           // }))

//           // .set('Accept', 'text/plain')
//           // .expect('Content-Type', 'text/plain; charset=uft-8')
//           .expect('Content-Type', /text\/html/)
//           .expect(200));
//     });
//   });
// });

// describe('Route integration', () => {
//   describe('/', () => {
//     describe('GET', () => {
//       it('responds with 200 status and text/html content type', async () => {
//         const response: any = await request(server).get('/');
//         // .then(res => {
//         //   console.log('this is res', res)
//         // }))

//         // .set('Accept', 'text/plain')
//         // .expect('Content-Type', 'text/plain; charset=uft-8')
//         // expect('Content-Type', /text\/html/)
//         expect(response.statusCode).toBe(200);
//       });
//     });
//   });
// });

describe("Testing / path", () => {
  test("it should respond with 200 status with GET method", () => {
    return request(app)
      .get("/")
      .expect(200);
  })
})
