import { get, run } from '../db/database';
import { hashPassword, comparePassword } from '../utils/auth';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

export const createUser = async (email: string, password: string, name: string, phone?: string): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  
  const result = await run(
    `INSERT INTO users (email, password_hash, name, phone) VALUES (?, ?, ?, ?)`,
    [email, hashedPassword, name, phone || null]
  );

  const user = await get(`SELECT * FROM users WHERE id = ?`, [result.id]);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    created_at: user.created_at
  };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    created_at: user.created_at
  };
};

export const getUserById = async (id: number): Promise<User | null> => {
  const user = await get(`SELECT * FROM users WHERE id = ?`, [id]);
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    created_at: user.created_at
  };
};

export const getUserWithPassword = async (email: string): Promise<any | null> => {
  return get(`SELECT * FROM users WHERE email = ?`, [email]);
};

export const verifyCredentials = async (email: string, password: string): Promise<User | null> => {
  const user = await getUserWithPassword(email);
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    created_at: user.created_at
  };
};
