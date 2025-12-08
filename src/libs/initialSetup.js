import Role from '../models/roles.models.js';
import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import {connectDB} from '../db.js';

export const initializeSetup = async ()=>{
    try {
        dotenv.config();

        connectDB();
        console.log("Base de datos conectada en initalSetup");

        const roleAdmin = process.env.SETUP_ROLE_ADMIN;
        const roleUser = process.env.SETUP_ROLE_USER;

        const countRole= await Role.estimatedDocumentCount();

        if(countRole == 0){
            console.log("Creando roles de usuario");
            await Promise.all([
                new Role({role:roleUser}).save(),
                new Role({role:roleAdmin}).save()
            ])
        };

        const setupAdminName= process.env.SETUP_ADMIN_USERNAME;
        const setupPwd=process.env.SETUP_ADMIN_PWD;
        const setupEmail=process.env.SETUP_ADMIN_EMAIL;
        //Buscamos si existe un usuario admin
        const userAdmin = await User.findOne({username:setupAdminName});
        if(userAdmin==null){
            console.log("Creando un usuario admin");
            const roleAdminDB = await Role.findOne({role:roleAdmin});
            const passwordAdmin= await bcryptjs.hash(setupPwd,10);
            const newUserAdmin = new User({
                username:setupAdminName,
                email: setupEmail,
                password: passwordAdmin,
                role:roleAdminDB._id
            });
            await newUserAdmin.save();
            console.log("Roles y usuariaos inicializados")
        };
    } catch (error) {
        console.log(error);
        console.log("Error al inicializar los roles de usuario");
    }
};

initializeSetup();