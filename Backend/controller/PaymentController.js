import Payment from "../models/payment.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

// Generate unique payment ID
const generatePaymentId = () => {
    return 'PAY-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Public
const createPayment = async (req, res) => {
    try {
        const { orderId, customerName, items, amount, method, receipt, pickupTime } = req.body;

        // Validation
        if (!orderId || !amount || !method) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID, amount and payment method are required" 
            });
        }

        if (amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Amount must be greater than 0" 
            });
        }

        // Check if payment already exists for this order
        const existingPayment = await Payment.findOne({ orderId });
        if (existingPayment) {
            return res.status(400).json({ 
                success: false, 
                message: "Payment already exists for this order" 
            });
        }

        // Create new payment
        const payment = new Payment({
            paymentId: generatePaymentId(),
            orderId,
            customerName: customerName || 'Guest',
            items: items || [],
            amount,
            method,
            receipt: receipt || false,
            status: method === 'Card' ? 'Complete' : 'Pending'
        });

        await payment.save();

        // Also create an Order record for the kitchen
        const order = new Order({
            orderId,
            email: req.user?.email || "guest@example.com",
            name: customerName || req.user?.firstName || "Guest",
            address: "Dine-in / Pickup",
            phone: req.user?.phone || "000-000-0000",
            status: "Pending",
            orderedItems: items.map(item => ({
                itemType: "product",
                itemId: item.id || `ITEM-${Date.now()}`,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: ""
            })),
            totalAmount: amount,
            pickupTime: pickupTime || "ASAP"
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment: {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                amount: payment.amount,
                method: payment.method,
                status: payment.status,
                createdAt: payment.createdAt
            }
        });

    } catch (error) {
        console.error("Create payment error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Duplicate payment detected" 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Server error while creating payment" 
        });
    }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching payments" 
        });
    }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Public
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        console.error("Get payment by ID error:", error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching payment" 
        });
    }
};

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Public
const getPaymentByOrderId = async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found for this order" 
            });
        }
        
        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        console.error("Get payment by order ID error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching payment" 
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Public
const updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['Pending', 'Complete'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Valid status (Pending/Complete) is required" 
            });
        }
        
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while updating payment status" 
        });
    }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Public
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });
    } catch (error) {
        console.error("Delete payment error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while deleting payment" 
        });
    }
};

// @desc    Get payment statistics
// @route   GET /api/payments/stats/dashboard
// @access  Public
const getPaymentStats = async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const completedPayments = await Payment.countDocuments({ status: 'Complete' });
        const pendingPayments = await Payment.countDocuments({ status: 'Pending' });
        
        const totalAmount = await Payment.aggregate([
            { $match: { status: 'Complete' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const methodBreakdown = await Payment.aggregate([
            { $group: { _id: "$method", count: { $sum: 1 }, total: { $sum: "$amount" } } }
        ]);
        
        res.status(200).json({
            success: true,
            stats: {
                total: totalPayments,
                completed: completedPayments,
                pending: pendingPayments,
                totalRevenue: totalAmount[0]?.total || 0
            },
            methodBreakdown
        });
    } catch (error) {
        console.error("Get payment stats error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching statistics" 
        });
    }
};

// Export all functions
export {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByOrderId,
    updatePaymentStatus,
    deletePayment,
    getPaymentStats
};