import User from '../models/user.models.js';
import Role from '../models/roles.models.js';
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

//Configuramos las variables de entorno
dotenv.config();

//Obtenemos el rol del usuario para el registro de usuarios
const roleUser = process.env.SETUP_ROLE_USER;

//Funcion para registrar usuarios
export const register = async (req,res)=>{
    const {username, email, password}=req.body;
    //console.log(username,email,password);

    //Crear nuevo usuario.
    try {
        //Validamos que el email no esté registrado
        const userFound = await User.findOne({email});
        if(userFound)//Ya está registrado
            return res.status(400).json({message:['El email ya está registrado']});

        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password,10);

        const role = await Role.findOne({role: roleUser});

        if(!role)
            return res.status(400).json({message:["El rol para usuarios no está definido"]})

        //Crear un nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role:role._id
        });
        const userSaved=await newUser.save()
        
        //Generamos el tokennde inicio de sesión.
        const token= await createAccessToken({id:userSaved._id});

        if(process.env.ENVIRONMENT=='local'){
            res.cookie('token',token,{
                sameSite:'lax',
            });
        }else{
            res.cookie('token',token,{
                sameSite:'none',
                secure:true,
            });
        }
        res.json({
            id:userSaved._id,
            username:userSaved.username,
            email:userSaved.email,
            role:role.role
        });
    } catch (error) {
        console.log(error);
        console.log("Error al registrarse");
        res.status(400).json({message:['Error al iniciar sesión']});
    }
}//Fin del register

//Funcion para iniciar sesión
export const login = async (req,res)=>{
    const {email,password}=req.body;
    try{
        //Buscamos el usuario por el email en la base de datos.
        const userFound=await User.findOne({email})
        if(!userFound)
            return res.status(400).json({message:["Usuario no encontrado"]})
        //Comparar el password que envió el usuario con la base de datos
        const isMatch = await bcryptjs.compare(password, userFound.password);
        //Si no coincide el password
        if(!isMatch)
            return res.status(400).json({message:["Password no coincide"]})
        //Si encuentra en la db y el password coincide
        //Generamos el token de inicio de sesión
        const token=await createAccessToken({id:userFound._id});

        if(process.env.ENVIRONMENT=='local'){
            res.cookie('token',token,{
                sameSite:'lax',
            });
        }else{
            res.cookie('token',token,{
                sameSite:'none',
                secure:true,
            });
        }
        const role = await Role.findById(userFound.role);
        if(!role)
            return res.status(400).json({message:["El rol para el usuario no esta definido"]})

        res.json({
            id:userFound._id,
            username:userFound.username,
            email:userFound.email,
            role:role.role
        });
        console.log("Inicio de sesión exitoso");
    } catch(error){
        console.log(error);
        console.log("Error al iniciar sesión");
    }
    //res.send("Login");
}//Fin del login

//Función para cerrar sesión
export const logout=(req,res)=>{
    res.cookie('token',"",{
        expires:new Date(0)
    })
    //Retornamos 200 = OK
    console.log("Cierre de sesión exitoso, ADIOS");
    return res.sendStatus(200);

}//Fin del logout.

//Función para obtener los datos del pefil del usuario
export const profile= async (req,res)=>{
    const userFound = await User.findById(req.user.id);

    if(!userFound)//No se encontro en la bd
        res.status(400).json({message:["Usuario no encontrado"]});

    const role=await Role.findById(userFound.role);
    if(!role)
        return res.status(400).json({message:["El rol para el usuario no esta definido"]})

    res.json({
        id:userFound._id,
        username:userFound.username,
        email:userFound.email,
        role:role.role
    })
   /*console.log(req.user);
    res.send("Profile");*/
}//Fin del profile

export const verifyToken = async (req,res)=>{
        const {token} = req.cookies;

        if(!token)
            return res.status(400).json({message:['No autorizado']})
    
    jwt.verify(token,TOKEN_SECRET,async(err,user)=>{
        if(err)
            return res.status(401).json({message:['No autorizado']})

        const userFound=await User.findById(user.id);
        if(!userFound)
            return res.status(401).json({message:['No autorizado']})

        const role = await Role.findById(userFound.role);
        if(!role)
            return res.status({message:['El rol del usuario no esta definido, no autorizado']})

        const userResponse={
            id:userFound._id,
            username:userFound.username,
            email: userFound.email,
            role:role.role
        }
        return res.json(userResponse);
    })
}

export const getAllProducts= async (req,res)=>{
    try {
        const products=await Product.find();
            res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:["Error al obtener los productos"]})
    }
}