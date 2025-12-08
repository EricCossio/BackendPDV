import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import {login,logout,profile,register,verifyToken} from '../controllers/auth.controller.js';
import { validateSchema } from "../middleware/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";


const router = Router();

//Ruta para registrar usuarios
router.post('/register', validateSchema(registerSchema),register);
//Ruta para iniciar sesión
router.post('/login', validateSchema(loginSchema),login);
//Ruta para cerrar sesión
router.post('/logout',logout);
//Ruta para el perfil del usuario
router.post('/profile',authRequired, profile)
//Ruta para verificar token
router.post('/verify',verifyToken);

export default router;