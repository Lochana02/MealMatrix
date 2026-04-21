import express from "express";
const router = express.Router();
import { createFeedback, getAllFeedback, getAverageRating, getFeedbackById, replyToFeedback, deleteFeedback } from "../controller/FeedbackController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.post("/", protect, createFeedback);
router.get("/", getAllFeedback);
router.get("/stats/average", getAverageRating);
router.get("/:id", getFeedbackById);
router.put("/:id/reply", protect, adminOnly, replyToFeedback);
router.delete("/:id", protect, adminOnly, deleteFeedback);

export default router;