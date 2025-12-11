// @desc    Récupérer tous les utilisateurs (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
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
    const { prenom, nom, email, password, confirmPassword } = req.body;

    // Validation des champs requis
    if (!prenom || !nom || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires",
      });
    }

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      prenom,
      nom,
      email,
      password,
      role: "user",
    });

    // Générer le token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: {
        user: {
          id: user._id,
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

  // @desc    Changer le rôle d'un utilisateur
  // @route   PUT /api/auth/role/:id
  // @access  Private/Admin
  export const updateUserRole = async (req, res, next) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      if (!role || !["user", "admin"].includes(role)) {
        return res.status(400).json({ success: false, message: "Rôle invalide" });
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }
      user.role = role;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Rôle mis à jour",
        data: {
          id: user._id,
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe",
      });
    }

    // Trouver l'utilisateur et inclure le mot de passe
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user._id,
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { prenom, nom, email } = req.body;

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour les champs
    if (prenom) user.prenom = prenom;
    if (nom) user.nom = nom;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil mis à jour",
      data: {
        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect",
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    next(error);
  }
};
