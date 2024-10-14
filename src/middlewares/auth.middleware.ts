import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { ModelContext } from '../models/ModelContext';

export default class AuthenticationFilter {
    authFilter(req: Request & { user?: any }, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];

        logger.info("Headers: ", req.headers);

        if (!authHeader) {
            logger.warn("No authorization header provided");
            return res.status(401).json({ message: 'No authorization header provided' });
        }

        const parts = authHeader.split(" ");
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            logger.warn("Malformed authorization header");
            return res.status(401).json({ message: 'Malformed authorization header' });
        }
    
        const token: string = parts[1];
        logger.info("Token received: " + token);

        try {
            // Verify the JWT token
            const decoded = jwt.verify(token, config.SECRET_KEY);
            logger.info("Decoded token: " + JSON.stringify(decoded));
            req.user = decoded;

            const user = ModelContext.getUserByEmail(req.user?.username);
            if (!user) {
                logger.warn("User not found for the provided email: " + req.user?.username);
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            logger.info(`Authenticated user: ${user.username}`);

            next();
        } catch (error: any) {
            logger.error("Invalid token: " + error.message);
            return res.status(401).json({
                message: 'Invalid token',
                error: error.message,
            });
        }
    }

    authorizeRole(requiredRole: string) {
        return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
            if (req.user && req.user.role === requiredRole) {
                logger.info(`User authorized with role: ${req.user.role}`);
                next();
            } else {
                logger.warn(`Forbidden access. Required role: ${requiredRole}, but found: ${req.user?.role}`);
                res.status(403).json({ message: 'Forbidden' });
            }
        };
    }
}
