import { Router } from 'express';
import { ProtectedProductController } from "../controllers/product_protected.controller"

const router = Router();

/**
 * @swagger
 * /api/v1/products/{id}:
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
router.delete('/products/:id', ProtectedProductController.deleteProduct);

export default router;
