import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller";


const router = Router();

/*
 * Create a new order from cart
 */
router.post(
  "/",
  authMiddleware,
  createOrder
);

/*
 * Get all orders of logged-in user
 */
router.get(
  "/",
  authMiddleware,
  getOrders
);

/*
 * Get a specific order
 */
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);


router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN"),
  updateOrderStatus
);

export default router;