import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Non authentifié" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_me");
    req.user = await User.findById(decoded.id).select("-password");
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Jeton invalide" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Non authentifié" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Accès refusé" });
  next();
};