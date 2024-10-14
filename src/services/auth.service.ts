import jwt from 'jsonwebtoken';
import RegistrationDTO from '../payloads/dto/register.dto';
import LoginDTO from '../payloads/dto/login.dto';
import { User } from '../interfaces/user.interface';
import { verifyPassword } from '../utils/security.utils';
import AuthenticationResponseObject from '../payloads/response/authResponseObject.vm';
import { config } from "../config/config"
import { ModelContext } from '../models/ModelContext';
import { logger } from '../utils/logger';

export class AuthService {
    
    static async register(registrationDto: RegistrationDTO): Promise<AuthenticationResponseObject> {
        try {
            await ModelContext.saveUser({
                username: registrationDto.username,
                password: registrationDto.password,
                name: registrationDto.name,
                id: -1,
            });
    
            const token = jwt.sign({ username: registrationDto.username }, config.SECRET_KEY ?? "", { expiresIn: '1h' });
    
            return {
                code: 200,
                jwt: token,
                message: "Successfully Registered."
            };
        } catch (e: any) {
            logger.error(`Error in register method: ${e.message}`, e);
            return {
                code: 400,
                jwt: "",
                message: e.message || 'An error occurred during registration',
            };
        }
    }
    

    static async authenticate(loginDto: LoginDTO) : Promise<AuthenticationResponseObject> {
        const user = ModelContext.getAllUsers().find(u => u.username === loginDto.username.trim());

        if (!user) {
            return {code : 400, message: 'Utilisateur non trouvé', jwt:""}
        }
        
        const isValidPassword = await verifyPassword(loginDto.password.trim(), user.password);
        if (!isValidPassword) {
            return {code : 400, message: 'Mot de passe incorrect', jwt: ""}
        }
    
        // Génération d'un JWT
        const token = jwt.sign({ username: user.username }, config.SECRET_KEY ?? "", { expiresIn: '1h' });
        return {
            code: 200,
            message: "Logged in Successfully",
            jwt: token,
        }
    }
}