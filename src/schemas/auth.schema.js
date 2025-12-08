import {z} from 'zod';

export const registerSchema=z.object({
    username:z.string("Nombre requerido")
    .min(5,{error:'El username debe tener al menos 5 caracteres'}),
    email:z.email({
        error: (email) => email.input === undefined ? 'El email es requerido'
                                                    : 'EL email es inavalido'
    }),
    password:z.string('Contraseña requerida')
    .min(6,{
        error:'La contraseña debe tener 6 caracteres mínimo'
    })
})//Fin del register

export const loginSchema=z.object({
    email:z.email({
        error: (email) => email.input === undefined ? 'El email es requerido'
                                                    : 'EL email es inavalido'
    }),
    password:z.string('Contraseña requerida')
    .min(6,{
        error:'La contraseña debe tener 6 caracteres mínimo'
    })
})//Fin del login