import User from '../models/user.models.js';
import Role from '../models/roles.models.js';
import dotenv from 'dotenv';

dotenv.config();

const roleAdmin = process.env.SETUP_ROLE_ADMIN;

export const isAdmin = async (req,res,next)=>{
    try{
        const userFound = await User.findById(req.user.id);

        if(!userFound)
            return res.status(400).json({message:["No autorizado, Usuario no encontrado"]});

        const role = await Role.findById(userFound.role);
        if(!role)
            return res.status({message:["No autorizado, el rol para el usuario no esta definido"]})
        if(role.role !=roleAdmin){
            return res.status(401).json({message:["EL usuario no esta autorizado para esta operación"]})
        }
        next();
    }catch(error){
        return res.status(401).json({message:["No autorizado"]})
    }
}