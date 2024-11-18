import { Router } from 'express';
import { ProductController } from '../../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     deprecated: true
 *     summary: Retrieves a list of products.
 *     security: []
 *     description: Retrieve a list of products from the API. Can be used to populate a list of products in your system.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/products', ProductController.getProducts);



export default router;
