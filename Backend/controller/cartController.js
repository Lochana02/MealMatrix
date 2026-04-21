import Cart from "../models/cart.js";

export const getCart = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = await Cart.create({ email, items: [] });
    }

    res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { items } = req.body;
    let cart = await Cart.findOneAndUpdate(
      { email },
      { items },
      { new: true, upsert: true } // Creates document if it doesn't exist
    );

    res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
