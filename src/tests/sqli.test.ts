import request from 'supertest';
import { describe, it } from 'mocha';
import app from '../app';


let expect: Chai.ExpectStatic;
(async () => {
    const chai = await import('chai');
    expect = chai.expect;
})();

describe('SQL Injection Stress Test', () => {
    const injectionPayloads = [
        `' OR '1'='1`,
        `'; DROP TABLE products;--`,
        `' OR 1=1--`,
        `"' OR ''='`,
        `1; DROP TABLE users;--`,
    ];

    injectionPayloads.forEach((payload, index) => {
        it(`should handle SQL injection attempt ${index + 1}`, async () => {
            const res = await request(app)
                .get(`/api/v2/products?minPrice=${payload}&maxPrice=${payload}`);

            console.log(res.status);
            

            expect(res.status).to.equal(400);
        });
    });
});