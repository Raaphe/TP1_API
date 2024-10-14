import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Authenticate user
 *     security: []
 *     description: Authenticates a user based on email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssw0rd123
 *     responses:
 *       200:
 *         description: Successful authentication
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/auth', AuthController.Authenticate);

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register new user
 *     security: []
 *     description: Creates a new user account with email, password, and name
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssw0rd123
 *     responses:
 *       201:
 *         description: Successfully registered new user
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       409:
 *         description: Conflict (email already exists)
 *       500:
 *         description: Internal server error
 */
router.post('/register', AuthController.Register);

export default router;
