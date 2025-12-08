import {z} from 'zod';

export const productSchema = z.object({
    name: z
        .string({ required_error: "El nombre del producto es requerido" })
        .min(1, { message: "El nombre del producto es requerido" }),

    price: z
        .string({ required_error: "El precio es requerido" })
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), { message: "El precio debe ser un número válido" })
        .refine(val => val > 0, { message: "El precio debe ser mayor a 0" }),

    quantity: z
        .string({ required_error: "La cantidad es requerida" })
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val), { message: "La cantidad debe ser un número válido" })
        .refine(val => val >= 0, { message: "La cantidad debe ser mayor o igual a 0" })
});//Fin de productSchema


export const productUpdateSchema = z.object({
    name: z
        .string({ required_error: "Nombre del producto requerido" })
        .min(1, { message: "Nombre del producto requerido" }),

    price: z
        .string({ required_error: "Precio del producto requerido" })
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), { message: "El precio debe ser un número válido" })
        .refine(val => val > 0, { message: "El precio debe ser mayor a 0" }),

    quantity: z
        .string({ required_error: "Cantidad del producto requerida" })
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val), { message: "La cantidad debe ser un número válido" })
        .refine(val => val >= 0, { message: "La cantidad debe ser mayor o igual a 0" }),

    image: z
        .string()
        .optional() 
});
//Fin de productUpdateSchema