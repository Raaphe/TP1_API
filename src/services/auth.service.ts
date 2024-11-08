import jwt from 'jsonwebtoken';
import RegistrationDTO from '../payloads/dto/register.dto';
import LoginDTO from '../payloads/dto/login.dto';
import { User } from '../interfaces/user.interface';
import { verifyPassword } from '../utils/security.utils';
import { config } from "../config/config"
import { ModelContext } from '../models/jsonModel/ModelContext';
import { logger } from '../utils/logger';
import ResponseObject from '../interfaces/response.interface';

export class AuthService {
    
    static async register(registrationDto: RegistrationDTO): Promise<ResponseObject<string>> {
        try {
            await ModelContext.saveUser({
                username: registrationDto.username,
                password: registrationDto.password,
                name: registrationDto.name,
                id: -1,
            });
    
            const token = jwt.sign({ username: registrationDto.username }, config.JWT_SECRET ?? "", { expiresIn: '1h' });
    
            return {
                code: 200,
                data: token,
                message: "Successfully Registered."
            };
        } catch (e: any) {
            logger.error(`Error in register method: ${e.message}`, e);
            return {
                code: 400,
                data: "",
                message: e.message || 'An error occurred during registration',
            };
        }
    }
    

    static async authenticate(loginDto: LoginDTO) : Promise<ResponseObject<string>> {
        const user = ModelContext.getAllUsers().find(u => u.username === loginDto.username.trim());

        if (!user) {
            return {code : 400, message: 'Utilisateur non trouvé', data:""}
        }
        
        const isValidPassword = await verifyPassword(loginDto.password.trim(), user.password);
        if (!isValidPassword) {
            return {code : 400, message: 'Mot de passe incorrect', data: ""}
        }
    
        // Génération d'un JWT
        const token = jwt.sign({ username: user.username }, config.JWT_SECRET ?? "", { expiresIn: '1h' });
        return {
            code: 200,
            message: "Logged in Successfully",
            data: token,
        }
    }
}