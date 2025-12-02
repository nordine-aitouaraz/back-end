import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not set in .env");
  }
  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

export const register = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, password, role } = req.body;
    if (!nom || !prenom || !telephone || !password) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }
    const exists = await User.findOne({ telephone });
    if (exists) return res.status(400).json({ success: false, message: "Téléphone déjà utilisé" });

    const user = await User.create({ nom, prenom, telephone, password, role });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      data: { id_user: user.id_user, nom: user.nom, prenom: user.prenom, telephone: user.telephone, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { telephone, password } = req.body;
    if (!telephone || !password) return res.status(400).json({ success: false, message: "Champs manquants" });

    // IMPORTANT : sélectionner explicitement le password si le schéma met select:false
    const user = await User.findOne({ telephone }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Identifiants invalides" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Identifiants invalides" });

    // retirer password avant réponse
    user.password = undefined;

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      token,
      data: { id_user: user.id_user, nom: user.nom, prenom: user.prenom, telephone: user.telephone, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.status(200).json({
      success: true,
      data: {
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};