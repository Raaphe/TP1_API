import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     deprecated: true
 *     summary: Retrieve a list of users
 *     security: []
 *     description: Retrieve a list of users from the API. Can be used to populate a list of users in your system.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  id:
 *                     type: integer
 *                     example: 1
 *                  name:
 *                     type: string
 *                     example: John Doe
 *                  mail:
 *                     type: string
 *                     example : john.doe@example.com
 */
router.get('/users', userController.getAllUsers);

export default router;