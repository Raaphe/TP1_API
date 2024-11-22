import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export default class AuthenticationFilter {

    authFilter(req: any, res: Response, next: NextFunction) {

        console.log(`============ URL ============\n${req.url}`);
        
        let whitelist = [
            "/docs"
        ];

        if (whitelist.some(path => req.url.startsWith(path))) {
            return next(); 
        }

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
            console.log("Token is valid", decoded);
            next(); 
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}
