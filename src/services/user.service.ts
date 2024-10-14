import { User } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

export class UserService {
  public static async getAllUsers(): Promise<User[]> {
    // Logique pour récupérer tous les utilisateurs
    return await new Promise((_) => _);
  }
}