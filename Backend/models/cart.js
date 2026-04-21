import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  price: Number,
  qty: Number,
  img: String,
  description: String
});

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
