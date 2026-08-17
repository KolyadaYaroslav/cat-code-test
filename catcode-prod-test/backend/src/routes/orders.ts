import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { createOrder, getOrdersByUserId, getOrderById, updateOrderStatus, getOrderNumber, getNextOrderStatus } from '../services/orderService';

const router = Router();

// Create order
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { recipientName, recipientPhone, address, paymentMethod, items } = req.body;

    if (!recipientName || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await createOrder(
      req.userId!,
      recipientName,
      recipientPhone,
      address,
      paymentMethod || 'cash',
      items
    );

    res.status(201).json({
      ...order,
      number: getOrderNumber(order.id)
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// Get user's orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getOrdersByUserId(req.userId!);
    const ordersWithNumbers = orders.map(order => ({
      ...order,
      number: getOrderNumber(order.id)
    }));
    res.json(ordersWithNumbers);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message || 'Failed to get orders' });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({
      ...order,
      number: getOrderNumber(order.id)
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message || 'Failed to get order' });
  }
});

// Update order status (admin only for now, but simplified)
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const order = await getOrderById(parseInt(id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // For demo: allow users to update their own orders
    if (order.user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedOrder = await updateOrderStatus(parseInt(id), status);
    res.json({
      ...updatedOrder,
      number: getOrderNumber(updatedOrder!.id)
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    res.status(500).json({ error: error.message || 'Failed to update order' });
  }
});

// Get next possible status
router.get('/:id/next-status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const nextStatus = getNextOrderStatus(order.status);
    res.json({ nextStatus });
  } catch (error: any) {
    console.error('Get next status error:', error);
    res.status(500).json({ error: error.message || 'Failed to get next status' });
  }
});

export default router;
