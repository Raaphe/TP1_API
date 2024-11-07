import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { loggers } from 'winston';
import { logger } from '../utils/logger';

export default class AuthenticationFilter {
    authFilter(req: any, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        
        logger.info(req.headers);


        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }
        
        const parts = authHeader.split(" ");
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Malformed authorization header' });
        }
    
        const token: string = parts[1];
        console.log("token -> " + token);
        
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            console.log("decoded -> " + JSON.stringify(decoded) + "\n");
            
            req.user = decoded;
            next();
        } catch (error: any) {
            return res.status(401).json({
                message: 'Invalid token',
                error: error.message,
                token: token
            });
        }
    }
    

    authorizeRole(role: string) {
        return (req: any, res: Response, next: NextFunction) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        };
    }
}

