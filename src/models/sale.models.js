import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  totalProducts: Number,
  subtotal: Number,
  total: Number,
  iva: String,
  status: String,
  shippingAddress: {
    name: String,
    address: String,
    phone: String
  },
  paymentMethod: Object
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
