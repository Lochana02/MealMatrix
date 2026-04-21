import Feedback from "../models/Feedback.js";

// Generate Feedback ID (FB-00001 format)
const generateFeedbackId = async () => {
    const lastFeedback = await Feedback.findOne().sort({ createdAt: -1 });
    
    let nextNumber = 1;
    
    if (lastFeedback && lastFeedback.feedbackId) {
        const parts = lastFeedback.feedbackId.split('-');
        if (parts.length === 2) {
            const lastNumber = parseInt(parts[1], 10);
            nextNumber = lastNumber + 1;
        }
    }
    
    const formattedNumber = nextNumber.toString().padStart(5, '0');
    return `FB-${formattedNumber}`;
};

// ✅ CREATE FEEDBACK (orderId removed)
export const createFeedback = async (req, res) => {
    try {
        const { name, email, rating, comment } = req.body;
        
        // Validation (orderId no longer required)
        if (!name || !email || !rating || !comment) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }
        
        const feedbackId = await generateFeedbackId();
        
        const feedback = new Feedback({
            feedbackId,
            name,
            email,
            rating,
            comment,
            status: "Pending"
        });
        
        const savedFeedback = await feedback.save();
        res.status(201).json({ success: true, feedback: savedFeedback });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ GET ALL FEEDBACK
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ success: true, count: feedbacks.length, feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ GET FEEDBACK BY ID
export const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        
        res.json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ REPLY TO FEEDBACK (Admin)
export const replyToFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        
        if (!reply || reply.trim() === '') {
            return res.status(400).json({ success: false, message: "Reply is required" });
        }
        
        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { 
                reply: reply,
                status: "Replied"
            },
            { new: true }
        );
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        
        res.json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ DELETE FEEDBACK
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        
        res.json({ success: true, message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ GET AVERAGE RATING
export const getAverageRating = async (req, res) => {
    try {
        const result = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" }, total: { $sum: 1 } } }
        ]);
        
        const avgRating = result.length > 0 ? result[0].avgRating.toFixed(1) : 0;
        const total = result.length > 0 ? result[0].total : 0;
        
        res.json({ success: true, averageRating: avgRating, totalFeedbacks: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};