import { get, all, run } from '../db/database';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number;
  recipient_name: string;
  recipient_phone?: string;
  address: string;
  payment_method?: string;
  created_at: string;
  items?: OrderItem[];
}

const ORDER_STATUSES = ['Оформлен', 'Оплачен', 'Собирается', 'В пути', 'Доставлен'];

export const createOrder = async (
  userId: number,
  recipientName: string,
  recipientPhone: string,
  address: string,
  paymentMethod: string,
  items: Array<{ productId: number; quantity: number; price: number }>
): Promise<Order> => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const result = await run(
    `INSERT INTO orders (user_id, recipient_name, recipient_phone, address, payment_method, total) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, recipientName, recipientPhone, address, paymentMethod, total]
  );

  const orderId = result.id;

  for (const item of items) {
    await run(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
       VALUES (?, ?, ?, ?)`,
      [orderId, item.productId, item.quantity, item.price]
    );
  }

  return getOrderById(orderId) as Promise<Order>;
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  const order = await get(`SELECT * FROM orders WHERE id = ?`, [id]);
  if (!order) return null;

  const items = await all(`SELECT * FROM order_items WHERE order_id = ?`, [id]);

  return {
    ...order,
    items
  };
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  const orders = await all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
  
  for (const order of orders) {
    order.items = await all(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
  }

  return orders;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<Order | null> => {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  await run(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId]);
  return getOrderById(orderId);
};

export const getOrderNumber = (orderId: number): string => {
  return `ORD-${String(orderId).padStart(6, '0')}`;
};

export const getNextOrderStatus = (currentStatus: string): string | null => {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === ORDER_STATUSES.length - 1) {
    return null;
  }
  return ORDER_STATUSES[currentIndex + 1];
};

export const getOrderStatuses = (): string[] => {
  return ORDER_STATUSES;
};
