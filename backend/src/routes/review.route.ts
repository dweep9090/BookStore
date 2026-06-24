import { Router } from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getBookReviews,
} from "../controllers/review.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import {
  reviewLimiter,
} from "../middlewares/rateLimit.middleware";

const router = Router();

/*
 * Create Review
 */
router.post(
  "/",
  authMiddleware,
  createReview
);

/*
 * Update Review
 */
router.put(
  "/:id",
  authMiddleware,
  reviewLimiter,
  updateReview
);

/*
 * Delete Review
 */
router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

/*
 * Get Reviews of a Book
 */
router.get(
  "/book/:bookId",
  getBookReviews
);

export default router;