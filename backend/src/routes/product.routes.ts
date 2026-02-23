import { Router } from 'express';
import {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, adjustStock, getCategories, getFilterOptions,
} from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/filter-options', getFilterOptions);
router.get('/:slug', getProduct);
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
router.patch('/:id/stock', authenticate, requireAdmin, adjustStock);

export default router;
