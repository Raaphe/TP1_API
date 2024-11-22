import request from 'supertest';
import { describe, it } from 'mocha';
import app from '../app';
import mongoose from 'mongoose';
import { config } from '../config/config';
import Product from '../models/product.model';
import jwt from 'jsonwebtoken';
import { ProductService } from '../services/product.service';
import { IProduct } from '../interfaces/product.interface';
import GetProductsPageDto from '../payloads/dto/getProductPage.dto';


let expect: Chai.ExpectStatic;
const getExpect = async () => {
    const chai = await import('chai');
    expect = chai.expect;
};

const mockToken = jwt.sign({ username: "info@test.com" }, config.JWT_SECRET ?? "", { expiresIn: '1h' });

describe('product rooutes', () => {
    before(async () => {
        await getExpect();
        await mongoose.connect(config.CLUSTER_URL_TEST ?? "", { dbName: "products_test", serverApi: { version: "1", deprecationErrors: true, strict: true } });
        await Product.deleteMany({});
    });

    after(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });


    describe('DELETE /api/v2/product/:id', () => {
        it('should return a 200 status and delete the product', async () => {
            const productCreateRes = (await ProductService.createProductV2({ description: "desc", name: "test name", price: 12, quantity: 2, _id: "" }));
            const product = productCreateRes.data;

            if (product === null || product === undefined) {
                expect(1).to.equal(2); // assert fail diy
                return;
            }

            // Make the DELETE request
            const res = await request(app)
                .delete(`/api/v2/product/${product._id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            // Assert the response
            expect(productCreateRes.code).to.equal(200);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Successfully deleted.');

            // Verify the product is deleted from the database
            const deletedProduct = await Product.findById(product._id);
            expect(deletedProduct).to.be.null;
        });

        it('should return a 404 status if product does not exist', async () => {
            // Make the DELETE request with a random ID
            const res = await request(app)
                .delete('/api/v2/product/618a59f13a4f1d3b68888888')
                .set("Authorization", `Bearer ${mockToken}`);

            // Assert the response
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('No Products Found.');
        });
    });


    describe('POST /api/v2/product', () => {
        it('should return a 200 status and create the product', async () => {
            let product = { description: "product testing", name: "test product create", price: 123, quantity: 12, _id: "" };

            // Make the DELETE request
            const res = await request(app)
                .post(`/api/v2/product`)
                .send(product)
                .set("Authorization", `Bearer ${mockToken}`);

            // Assert the response
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Created Successfully');

            // Verify the product is added to the database
            const addedProduct = await Product.findById(product._id);
            expect(addedProduct?.id).to.be.equal(res.body.data.id);
        });
    });

    describe('PUT /api/v2/product', () => {
        it('should return a 200 status and update the product', async () => {
            const product = (await ProductService.createProductV2({ description: "desc", name: "test name", price: 12, quantity: 2, _id: "" })).data;

            if (product?._id === null || product?._id === undefined) {
                expect(1).to.equal(2); // assert fail diy
                return;
            }

            // Make the DELETE request
            const res = await request(app)
                .put(`/api/v2/product`)
                .send({ _id: product._id, description: "test test", name: "new name", price: 321, quantity: 999 } as IProduct)
                .set("Authorization", `Bearer ${mockToken}`);

            // Assert the response
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Updated product sucessfully');

            const updatedProduct = await Product.findById(product._id);

            expect(updatedProduct?._id).to.be.equal(res.body.data._id);
        });
    });

    describe('GET /api/v2/products', () => {
        it('should return a 200 status and get filtered products', async () => {
            // Create test products
            const product1 = await ProductService.createProductV2({ description: "desc", name: "test name", price: 100, quantity: 2, _id: "" });
            const product2 = await ProductService.createProductV2({ description: "desc", name: "test name", price: 200, quantity: 4, _id: "" });
            await ProductService.createProductV2({ description: "desc", name: "test name", price: 300, quantity: 6, _id: "" });
            await ProductService.createProductV2({ description: "desc", name: "test name", price: 400, quantity: 8, _id: "" });

            // Query parameters
            const query = {
                minPrice: 120,
                maxPrice: 320,
                minStock: 2,
                maxStock: 6
            };

            const response = await request(app)
                .get('/api/v2/products')
                .query(query);

            console.log(JSON.stringify(response.body, null, 2));

            expect(response.status).to.equal(200);
            expect(response.body.data.length).to.equal(2);
        });
    });
});