import { Router } from "express";

import {
  getDashboardStats,
  getTopRatedBooks,
  getRecentOrders,
  getStockLogs
} from "../controllers/admin.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/stats",
  authMiddleware,
  requireRole("ADMIN"),
  getDashboardStats
);

router.get(
  "/top-rated-books",
  authMiddleware,
  requireRole("ADMIN"),
  getTopRatedBooks
);

router.get(
  "/recent-orders",
  authMiddleware,
  requireRole("ADMIN"),
  getRecentOrders
);

router.get(
  "/stock-logs",
  authMiddleware,
  requireRole("ADMIN"),
  getStockLogs
);

export default router;