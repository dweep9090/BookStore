import { Router } from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getWishlist);

router.post("/", authMiddleware, addToWishlist);

router.delete(
  "/:bookId",
  authMiddleware,
  removeFromWishlist
);

export default router;