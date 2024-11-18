import request from 'supertest';
import { describe, it } from 'mocha';
import app from '../app';

let expect: Chai.ExpectStatic;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();


describe('GET /', () => {
  it('should return a 200 status', (done) => {
    request(app)
      .get('/')
      .end((err: any, res: any) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
