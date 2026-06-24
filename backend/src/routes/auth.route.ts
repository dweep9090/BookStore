import { Router } from "express";

import {
  authLimiter,
} from "../middlewares/rateLimit.middleware";

import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;