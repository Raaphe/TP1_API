import { Router } from 'express';
import { ProtectedProductController } from "../controllers/product_protected.controller"

const router = Router();

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Deletes a specified product.
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a product by its specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the product.
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       404:
 *         description: Product not found.
 */
router.delete('/products/:id', ProtectedProductController.deleteProduct);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Creates a new product.
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new product by providing a name, description, price, and quantity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product (between 3 and 50 characters).
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 description: The description of the product.
 *                 example: "This is a description of the product."
 *               price:
 *                 type: number
 *                 description: The price of the product (positive number).
 *                 example: 99.99
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product (positive integer).
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product successfully created.
 *       400:
 *         description: Bad request (e.g., validation error).
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.post('/products', ProtectedProductController.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Updates an existing product.
 *     security:
 *       - bearerAuth: []
 *     description: Updates the product details such as name, description, price, or quantity.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the product (between 3 and 50 characters).
 *               description:
 *                 type: string
 *                 description: The updated description of the product.
 *               price:
 *                 type: number
 *                 description: The updated price of the product (positive number).
 *               quantity:
 *                 type: integer
 *                 description: The updated quantity of the product (positive integer).
 *     responses:
 *       200:
 *         description: Product successfully updated.
 *       400:
 *         description: Bad request (e.g., validation error).
 *       404:
 *         description: Product not found.
 */
router.put('/products/:id', ProtectedProductController.updateProduct);


export default router;
