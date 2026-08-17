import { Router, Response, Request } from 'express';
import { getProducts, getProductById, getProductsByCategory, getCategories, searchProducts } from '../services/productService';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ error: error.message || 'Failed to get products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ error: error.message || 'Failed to get product' });
  }
});

// Get categories
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message || 'Failed to get categories' });
  }
});

// Search products
router.get('/search/query', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const products = await searchProducts(q);
    res.json(products);
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Search failed' });
  }
});

export default router;
