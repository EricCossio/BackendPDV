import express from "express";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log("Backend ",process.env.BASE_URL_BACKEND);
console.log("Fronend ",process.env.BASE_URL_FRONTEND);

//Importamos las rutas para los usuarios
import authRoutes from './routes/auth.routes.js';
//Importamos las rutas para productos
import productRoutes from './routes/products.routes.js';


const app= express();
app.use(cors({
    origin:[
        process.env.BASE_URL_BACKEND,
        process.env.BASE_URL_FRONTEND
    ],
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());//Cookie en formto Json
//Recibir imagenes en el req.body
app.use(express.urlencoded({extended: true})); //Recibir imagenes

//Indicamos al servidor que utilice las rutas del obketo authRoutes
app.use('/api/', authRoutes);
app.use('/api/', productRoutes);

export default app;