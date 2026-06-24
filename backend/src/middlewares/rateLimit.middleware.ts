import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    success: false,
    message:
      "Too many attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,

  message: {
    success: false,
    message:
      "AI request limit reached. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,

  message: {
    success: false,
    message:
      "Too many review requests.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});