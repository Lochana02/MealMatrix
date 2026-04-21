import express from "express";
import {
    createPayment,
    getAllPayments,
    getPaymentStats,
    getPaymentByOrderId,
    getPaymentById,
    updatePaymentStatus,
    deletePayment
} from "../controller/PaymentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", protect, createPayment);
router.get("/", protect, adminOnly, getAllPayments);
router.get("/stats/dashboard", protect, adminOnly, getPaymentStats);
router.get("/order/:orderId", protect, getPaymentByOrderId);
router.get("/:id", protect, getPaymentById);
router.put("/:id/status", protect, adminOnly, updatePaymentStatus);
router.delete("/:id", protect, adminOnly, deletePayment);

export default router;