import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import universesRoutes from "./routes/universes.js";
import favoritesRoutes from "./routes/favorites.js";
import uploadRoutes from "./routes/upload.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js"; // ✅ NOUVEAU

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Echecs Mangas" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/universes", universesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes); // ✅ NOUVEAU

app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));
app.use(errorHandler);

export default app;
