import {Router} from 'express';
import {authRequired} from '../middleware/validateToken.js';
import { getAllProducts,getProducts,createProduct,getProduct,deleteProduct,updateProductWithImage,updateProductWithoutImage } from '../controllers/products.controller.js';
import { productSchema,productUpdateSchema } from '../schemas/product.schema.js';
import { validateSchema } from '../middleware/validateSchema.js';
import { uploadToCloudinary } from '../middleware/uploadImage.js';
import { isAdmin } from '../middleware/isAdmin.js';
import multer from "multer";
const router = Router();

//Ruta para obtener todos los productos para la compra
router.get('/products/getallproducts', authRequired, getAllProducts)

//Ruta para obtener todos los productos
router.get('/products', authRequired, getProducts);

//Ruta para crear un producto
router.post('/products', authRequired, isAdmin, uploadToCloudinary,
    validateSchema(productSchema), createProduct);

//Ruta para obtener un producto por ID
router.get('/products/:id', authRequired, isAdmin, getProduct);

//Ruta para eliminar un producto 
router.delete('/products/:id', authRequired, isAdmin, deleteProduct);

//Ruta para actualizar un producto sin actualizar imagen
router.put('/products/:id', authRequired, isAdmin, validateSchema(productUpdateSchema), updateProductWithoutImage);

//Ruta para actualizar un producto y CAMBIAR la imagen
router.put('/products/updatewithimage/:id', authRequired, isAdmin, uploadToCloudinary,
                                            validateSchema(productSchema), updateProductWithImage);

//Ruta para obtener todos los productos para la compra
router.get('/getallproducts', getAllProducts)

export default router;
