import { Router } from "express";

import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} from "../controllers/cart.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getCart);

router.post("/", authMiddleware, addToCart);

router.put("/:itemId", authMiddleware, updateQuantity);

router.delete("/:itemId", authMiddleware, removeItem);

export default router;