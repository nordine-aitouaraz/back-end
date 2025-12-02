import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import universesRoutes from "./routes/universes.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Requête reçue !", req.method, req.url);
  next();
});

// Route racine - info API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Echecs Mangas Backend",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      universes: "/api/universes",
    },
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/universes", universesRoutes);

// 404 handler (conserver si tu en as besoin)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// Remplacer le handler inline par le middleware d'erreur centralisé
app.use(errorHandler);

export default app;