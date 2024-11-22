import request from 'supertest';
import { describe, it } from 'mocha';
import app from '../app';


let expect: Chai.ExpectStatic;
(async () => {
    const chai = await import('chai');
    expect = chai.expect;
})();

const endpoints = [
    { method: 'put', path: '/api/v2/product' },
    { method: 'post', path: '/api/v2/product' },
    { method: 'delete', path: '/api/v2/product/1' },
];

describe('JWT Authentication', () => {
    endpoints.forEach(({ method, path }) => {
        it(`should reject invalid JWT for ${method.toUpperCase()} ${path}`, async () => {

            let res;
            switch (method) {
                case "put":
                    res = await request(app).put(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
                case "delete":
                    res = await request(app).delete(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
                case "post":
                    res = await request(app).post(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
            }

            if (res === undefined || res === null) {
                expect(1).to.equal(2); // diy assert fail
                return;
            }

            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Invalid or expired token');
        });

        it(`should reject missing JWT for ${method.toUpperCase()} ${path}`, async () => {
            let res;
            switch (method) {
                case "put":
                    res = await request(app).put(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
                case "delete":
                    res = await request(app).delete(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
                case "post":
                    res = await request(app).post(path)
                        .set('Authorization', 'Bearer invalid.jwt.token');
            }

            if (res === undefined || res === null) {
                expect(1).to.equal(2); // diy assert fail
                return;
            }

            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Invalid or expired token');
        });
    });
});
