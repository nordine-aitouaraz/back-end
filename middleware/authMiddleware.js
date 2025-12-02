import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Fail fast: require secret at startup
  throw new Error("JWT_SECRET not defined in environment");
}

export const protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Non authentifié" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Utilisateur introuvable" });
    req.user = user;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Jeton expiré" });
    }
    // JsonWebTokenError or other
    return res.status(401).json({ success: false, message: "Jeton invalide" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Non authentifié" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Accès refusé" });
  next();
};