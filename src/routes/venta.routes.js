import { Router } from 'express';
import { authRequired } from '../middleware/validateToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { createSale, getSales, getSaleById } from '../controllers/venta.controller.js';
import { saleSchema } from '../schemas/venta.schema.js';
import { validateSchema } from '../middleware/validateSchema.js';

const router = Router();

// Ruta para crear una venta
// Solo usuarios autenticados pueden hacer ventas
router.post('/sales', authRequired, validateSchema(saleSchema), createSale);

// Ruta para obtener todas las ventas
// Admin ve todas, usuario normal solo las suyas
router.get('/sales', authRequired, getSales);

// Ruta para obtener una venta por ID
router.get('/sales/:id', authRequired, getSaleById);

// Exportamos el router
export default router;
