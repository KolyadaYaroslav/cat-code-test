import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          status TEXT DEFAULT 'Оформлен',
          total REAL NOT NULL,
          recipient_name TEXT NOT NULL,
          recipient_phone TEXT,
          address TEXT NOT NULL,
          payment_method TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price_at_purchase REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Seed initial products if table is empty
      db.run(`SELECT COUNT(*) as count FROM products`, (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count === 0) {
          const products = [
            { name: 'Семя быка Ангус', category: 'Семя', price: 5000, stock: 50, description: 'Премиум семя быка породы Ангус' },
            { name: 'Семя быка Герефорд', category: 'Семя', price: 4500, stock: 60, description: 'Качественное семя быка Герефорд' },
            { name: 'Жидкий азот 1л', category: 'Расходники', price: 800, stock: 200, description: 'Криогенный азот для консервации' },
            { name: 'Жидкий азот 5л', category: 'Расходники', price: 3500, stock: 100, description: 'Резервуар жидкого азота 5 литров' },
            { name: 'Набор инструментов', category: 'Инструменты', price: 15000, stock: 20, description: 'Профессиональный набор для осеменения' },
            { name: 'Шприц осеменения 100мл', category: 'Инструменты', price: 500, stock: 500, description: 'Специализированный шприц для осеменения' },
            { name: 'Контейнер для хранения', category: 'Оборудование', price: 8000, stock: 30, description: 'Теплоизолированный контейнер для семени' },
            { name: 'Перчатки латексные (100шт)', category: 'Расходники', price: 300, stock: 1000, description: 'Медицинские перчатки для процедур' }
          ];

          products.forEach(product => {
            db.run(
              `INSERT INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)`,
              [product.name, product.category, product.price, product.stock, product.description],
              (err) => {
                if (err) console.error('Error seeding product:', err);
              }
            );
          });
        }
        resolve();
      });
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const all = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};
