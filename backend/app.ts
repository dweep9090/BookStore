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
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8000;

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
