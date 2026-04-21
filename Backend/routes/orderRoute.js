import express from "express";
import { createOrder, deleteOrder, getOrderByEmail, getOrderById, getOrders, updateOrder } from "../controller/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);
orderRouter.get("/", protect, adminOnly, getOrders);
orderRouter.get("/email/:email", protect, getOrderByEmail);
orderRouter.get("/:orderId", protect, getOrderById);
orderRouter.put("/:orderId", protect, adminOnly, updateOrder);
orderRouter.delete("/:orderId", protect, adminOnly, deleteOrder);



export default orderRouter;