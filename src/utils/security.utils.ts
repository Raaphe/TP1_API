import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import { config } from '../config/config';

const secretKey = config.JWT_SECRET;
const iv = Buffer.alloc(16, 0);

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function generateRSAKeys(bits: number = 512) {
  const key = new NodeRSA({ b: bits });
  return {
    publicKey: key.exportKey('public'),
    privateKey: key.exportKey('private'),
    key
  };
}

export function encryptWithPublicKey(key: NodeRSA, data: string) {
  return key.encrypt(data, 'base64');
}

export function decryptWithPrivateKey(key: NodeRSA, encryptedData: string) {
  return key.decrypt(encryptedData, 'utf8');
}
