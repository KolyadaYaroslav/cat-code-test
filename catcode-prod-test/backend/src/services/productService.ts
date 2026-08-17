import { get, all } from '../db/database';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  created_at: string;
}

export const getProducts = async (): Promise<Product[]> => {
  return all(`SELECT * FROM products ORDER BY category, name`);
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return get(`SELECT * FROM products WHERE id = ?`, [id]);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return all(`SELECT * FROM products WHERE category = ? ORDER BY name`, [category]);
};

export const getCategories = async (): Promise<string[]> => {
  const rows = await all(`SELECT DISTINCT category FROM products ORDER BY category`);
  return rows.map(row => row.category);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const searchPattern = `%${query}%`;
  return all(
    `SELECT * FROM products WHERE name LIKE ? OR description LIKE ? ORDER BY category, name`,
    [searchPattern, searchPattern]
  );
};
