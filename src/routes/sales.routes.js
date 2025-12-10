import { Router } from "express";
import { createSale, getAllSales } from "../controllers/sales.controller.js";

const router = Router();

router.post("/sales", createSale);
//Ruta para obtener todas las ventas
router.get('/sales/getallsales', getAllSales)
export default router;
