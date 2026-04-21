import express from 'express';
import { getCart, updateCart } from '../controller/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.get("/", protect, getCart);
cartRouter.put("/", protect, updateCart);

export default cartRouter;
