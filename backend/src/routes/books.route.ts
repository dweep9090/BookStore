import { Router } from "express";

import {
  aiLimiter,
} from "../middlewares/rateLimit.middleware";

import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  generateSummary,
  getRecommendations
} from "../controllers/books.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getBooks);

router.get("/:id", getBookById);

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  createBook
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  updateBook
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  deleteBook
);

router.post(
  "/:id/generate-summary",
  authMiddleware,
  aiLimiter,
  generateSummary
);

router.get(
  "/:id/recommendations",
  getRecommendations
);

export default router;

// books/070458aa-46fd-4b7c-889f-0d863fcfb889/recommendations