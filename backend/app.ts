import "dotenv/config";
import express from "express";
import authRoutes from "./src/routes/auth.route";
import booksRoutes from "./src/routes/books.route";
import cartRoutes from "./src/routes/cart.route";
import wishlistRoutes from "./src/routes/wishlist.route";
import orderRoutes from "./src/routes/order.route";
import paymentRoutes from "./src/routes/payment.route";
import reviewRoutes from "./src/routes/review.route";
import adminRoutes from "./src/routes/admin.route";
import cors from "cors";
import {
  generateBookSummary,
} from "./src/services/gemini.service";
import { prisma } from "./src/lib/prisma";
import helmet from "helmet";

const app = express();
const PORT = 8000;

app.use(helmet({
  contentSecurityPolicy:false
}));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      count: users.length,
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error?.message,
      stack: error?.stack,
    });
  }
});

app.get("/test-ai", async (req, res) => {
  try {
    const summary =
      await generateBookSummary(
        "Clean Code",
        "Robert C Martin",
        "A handbook of agile software craftsmanship"
      );

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// console.log("DATABASE_URL =", process.env.DATABASE_URL);
// console.log("JWT_SECRET =", process.env.JWT_SECRET);
// console.log("JWT_REFRESH_SECRET =", process.env.JWT_REFRESH_SECRET);

app.listen(PORT, ()=> console.log("Server started at port", PORT));
