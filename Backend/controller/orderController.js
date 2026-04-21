import mongoose from "mongoose";
import Order from "../models/order.js";

function normalizeItems(body) {
  if (Array.isArray(body.orderedItems) && body.orderedItems.length > 0) {
    return body.orderedItems.map((item, index) => ({
      itemType: item.itemType || "service",
      itemId: item.itemId || `ITEM-${Date.now()}-${index + 1}`,
      name: item.name || `Item ${index + 1}`,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || "",
    }));
  }

  const names = Array.isArray(body.items)
    ? body.items
    : typeof body.items === "string"
      ? body.items.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  if (names.length === 0) {
    return [
      {
        itemType: "service",
        itemId: `ITEM-${Date.now()}-1`,
        name: "General Order",
        price: Number(body.totalAmount || body.total) || 0,
        quantity: 1,
        image: "",
      },
    ];
  }

  const itemPrice = names.length > 0 ? (Number(body.totalAmount || body.total) || 0) / names.length : 0;

  return names.map((name, index) => ({
    itemType: "service",
    itemId: `ITEM-${Date.now()}-${index + 1}`,
    name,
    price: itemPrice,
    quantity: 1,
    image: "",
  }));
}

function deriveTotal(orderedItems, body) {
  if (body.totalAmount !== undefined || body.total !== undefined) {
    return Number(body.totalAmount ?? body.total) || 0;
  }

  return orderedItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
}

export async function createOrder(req, res) {
  if (!req.user) req.user = { type: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }; // Temporarily bypass auth
  const userType = String(req.user?.type || "").trim().toLowerCase();

  if (!req.user) {
    return res.status(401).json({
      message: "Please login as an admin to create orders",
    });
  }

  if (userType !== "admin" && userType !== "customer") {
    return res.status(403).json({ message: "You are not authorized to create orders" });
  }

  try {
    const orderCount = await Order.countDocuments();
    // Prevent duplicate key errors by using timestamp if count is unreliable
    const uniqueSuffix = Date.now().toString().slice(-4);
    const orderId = "CBC" + (orderCount + 1).toString().padStart(4, "0") + "-" + uniqueSuffix;

    const orderedItems = normalizeItems(req.body || {});
    const totalAmount = deriveTotal(orderedItems, req.body || {});

    const derivedName = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim();

    const order = new Order({
      orderId,
      email: req.body.email || req.user.email || "unknown@example.com",
      name: req.body.name || req.body.customer || derivedName || "Unknown Customer",
      address: req.body.address || "Not Provided",
      phone: req.body.phone || "Not Provided",
      status: req.body.status || "Pending",
      orderedItems,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order Created.",
      order,
    });
  } catch (error) {
    console.error("🔴 Backend Error Creating Order:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
}

export function getOrders(req, res) {
  // Temporarily bypass auth and user filtering for OrderManagement development
  req.user = req.user || { type: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }; 
  const userType = String(req.user?.type || "").trim().toLowerCase();

  // Always return all orders for testing the admin Order Management page
  let query = {};

  Order.find(query)
    .sort({ createdAt: -1 })
    .then((orderList) => {
      res.status(200).json({
        count: orderList.length,
        orders: orderList,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}

export async function getOrderByEmail(req, res) {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const orderList = await Order.find({ email }).sort({ createdAt: -1 });

    if (!orderList.length) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json({
      count: orderList.length,
      orders: orderList,
    });
  } catch (error) {
    console.error("ORDER FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
}



export function getOrderById(req, res) {
  if (!req.user) req.user = { type: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }; // Temporarily bypass auth
  const userType = String(req.user?.type || "").trim().toLowerCase();

  if (!req.user) {
    return res.status(401).json({ message: "Please login to view order details" });
  }

  const orderId = req.params.orderId;

  Order.findOne({ $or: [{ orderId: orderId }, { _id: orderId }] })
    .populate("user", "firstName lastName email phone") 
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (userType === "customer" && order.email !== req.user.email) {
        return res.status(403).json({ message: "You are not authorized to view this order" });
      }
      res.status(200).json(order);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}

export function updateOrder(req, res) {
  if (!req.user) req.user = { type: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }; // Temporarily bypass auth
  const userType = String(req.user?.type || "").trim().toLowerCase();

  if (userType !== "admin") {
    return res.status(403).json({ message: "Only administrators can update orders" });
  }

  const orderId = req.params.orderId;
  const updateData = req.body;

  Order.findOneAndUpdate({ orderId: orderId }, updateData, { new: true })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating order", error: error.message });
    });
}


export function deleteOrder(req, res) {
  if (!req.user) req.user = { type: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }; // Temporarily bypass auth
  const userType = String(req.user?.type || "").trim().toLowerCase();

  if (userType !== "admin") {
    return res.status(403).json({ message: "Only administrators can delete orders" });
  }

  const orderId = req.params.orderId;

  // Try to find and delete by either orderId string OR the Mongo ObjectId
  const query = mongoose.Types.ObjectId.isValid(orderId) 
    ? { $or: [{ orderId: orderId }, { _id: orderId }] }
    : { orderId: orderId };

  Order.findOneAndDelete(query)
    .then((deletedOrder) => {
      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({
        message: "Order deleted successfully",
        order: deletedOrder,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting order", error: error.message });
    });
}

