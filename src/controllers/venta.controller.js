import Sale from '../models/venta.model.js';
import Product from '../models/product.models.js';

// Crear una venta
export const createSale = async (req, res) => {
    try {
        const { products } = req.body; // Array de productos con {product: id, quantity: n}
        if (!products || products.length === 0) {
            return res.status(400).json({ message: ['No se han enviado productos para la venta'] });
        }

        // Obtener los detalles de cada producto y calcular total
        let total = 0;
        const productsDetails = await Promise.all(products.map(async (p) => {
            const prod = await Product.findById(p.product);
            if (!prod) throw new Error(`Producto con ID ${p.product} no encontrado`);

            if (p.quantity > prod.quantity) {
                throw new Error(`No hay suficiente stock de ${prod.name}`);
            }

            // Reducimos stock
            prod.quantity -= p.quantity;
            await prod.save();

            total += prod.price * p.quantity;

            return {
                product: prod._id,
                quantity: p.quantity,
                price: prod.price
            };
        }));

        const newSale = new Sale({
            user: req.user.id,
            products: productsDetails,
            total
        });

        const savedSale = await newSale.save();
        res.json(savedSale);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: [error.message || 'Error al crear la venta'] });
    }
};

// Obtener todas las ventas
export const getSales = async (req, res) => {
    try {
        const isAdmin = req.user.role === process.env.ROLE_ADMIN;

        let query = {};
        if (!isAdmin) {
            query.user = req.user.id;
        }

        const sales = await Sale.find(query).populate('user').populate('products.product');
        res.json(sales);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener las ventas'] });
    }
};

// Obtener venta por ID
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('user').populate('products.product');
        if (!sale) return res.status(404).json({ message: ['Venta no encontrada'] });
        res.json(sale);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener la venta'] });
    }
};
