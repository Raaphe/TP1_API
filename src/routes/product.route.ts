import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieves a list of products with optional filtering by price and stock.
 *     security: []
 *     description: Returns a list of products with filtering options for price and stock. The response includes the product's ID, name, description, category, quantity available, and price.
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           description: The minimum price of the products to retrieve.
 *           example: 10.00
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           description: The maximum price of the products to retrieve.
 *           example: 100.00
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: integer
 *           description: The minimum quantity of stock to retrieve.
 *           example: 5
 *       - in: query
 *         name: maxStock
 *         schema:
 *           type: integer
 *           description: The maximum quantity of stock to retrieve.
 *           example: 50
 *     responses:
 *       200:
 *         description: A list of products with optional filters applied.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the product.
 *                     example: "60b6a3bc6f3c4a001f4c6bc8"
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *                     example: "Sample Product"
 *                   description:
 *                     type: string
 *                     description: The description of the product.
 *                     example: "This is a sample product description."
 *                   category:
 *                     type: string
 *                     description: The category the product belongs to.
 *                     example: "Electronics"
 *                   price:
 *                     type: number
 *                     description: The price of the product.
 *                     example: 99.99
 *                   quantity:
 *                     type: integer
 *                     description: The available quantity of the product.
 *                     example: 20
 *       400:
 *         description: Bad request (e.g., invalid filter parameters).
 */
router.get('/products', ProductController.getProducts);




export default router;
