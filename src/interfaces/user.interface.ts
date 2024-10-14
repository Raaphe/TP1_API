import { Role } from "./role.interface";

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  role: Role
}