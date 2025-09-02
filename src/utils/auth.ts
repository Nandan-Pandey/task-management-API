import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key'; // Store securely in .env

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
//   return await bcrypt.compare(password, hash);
return password === hash; 
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
