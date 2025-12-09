import Sale from "../models/sale.models.js";

export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    const savedSale = await sale.save();

    res.status(201).json(savedSale);
  } catch (error) {
    console.error("Error al guardar la venta:", error);
    res.status(500).json({ message: "Error al guardar la venta" });
  }
};

export const getAllSales = async (req, res)=>{
    try {
    const sale = await Sale.find( ); 
    res.json(sale);
    } catch (error){
        console.log(error);
        res.status(500)
        .json({message:['Error al obtener todos las ventas']})
    }
};//Fin de getAllProducts