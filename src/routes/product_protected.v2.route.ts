import { Router } from 'express';
import { ProtectedProductController } from "../controllers/product_protected.controller"

const router = Router();

/**
 * @swagger
 * /api/v2/product/{id}:
 *   delete:
 *     summary: Deletes a specified product.
 *     description: Deletes a product by its specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the product. 
 *       204:
 *         description: Successfully deleted the product.
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       404:
 *         description: Product not found.
 */
router.delete('/products/:id', ProtectedProductController.deleteProductV2);

/**
 * @swagger
 * /api/v2/product:
 *   post:
 *     summary: Updates a product.
 *     description: Updates a product with details including name, description, price, and quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Unique identifier for the product.
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: "Sample Product"
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: "This is a sample product."
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 19.99
 *               quantity:
 *                 type: integer
 *                 description: Available quantity of the product.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Successfully created the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 data:
 *                   type: object
 *                   description: The created product object.
 *       400:
 *         description: Bad request (e.g., invalid data).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid product data provided."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error."
 */
router.put('/product', ProtectedProductController.updateProductV2);

/**
 * @swagger
 * /api/v2/product:
 *   post:
 *     summary: Creates a new product.
 *     description: Creates a new product with details including name, description, price, and quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Unique identifier for the product.
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: "Sample Product"
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: "This is a sample product."
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 19.99
 *               quantity:
 *                 type: integer
 *                 description: Available quantity of the product.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Successfully created the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 data:
 *                   type: object
 *                   description: The created product object.
 *       400:
 *         description: Bad request (e.g., invalid data).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid product data provided."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error."
 */
router.post('/product', ProtectedProductController.createProductV2);

export default router;
