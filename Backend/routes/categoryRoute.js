import express from "express";
import controller from "../controller/categoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ROUTES
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategory);
router.post("/", protect, adminOnly, controller.createCategory);
router.put("/:id", protect, adminOnly, controller.updateCategory);
router.delete("/:id", protect, adminOnly, controller.deleteCategory);

export default router;