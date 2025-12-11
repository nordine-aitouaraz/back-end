import express from "express";
import { getAllUsers } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route pour récupérer tous les utilisateurs (admin seulement)
router.get("/", protect, authorize("admin"), getAllUsers);

export default router;
