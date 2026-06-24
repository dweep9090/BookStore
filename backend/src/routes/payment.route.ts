import { Router } from "express";

import {
  mockCheckout,
  mockPaymentSuccess,
} from "../controllers/payment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/*
 * Start checkout process
 */
router.post(
  "/checkout",
  authMiddleware,
  mockCheckout
);

/*
 * Mock payment success
 */
router.post(
  "/success",
  authMiddleware,
  mockPaymentSuccess
);

export default router;