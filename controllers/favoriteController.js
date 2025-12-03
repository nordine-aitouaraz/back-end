import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";

// @desc    Récupérer tous les favoris de l'utilisateur connecté
// @route   GET /api/favorites
// @access  Private
export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: "product",
        populate: [
          { path: "universe", select: "name image" },
          { path: "category", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un produit aux favoris
// @route   POST /api/favorites/:productId
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    // Vérifier si déjà en favori
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Ce produit est déjà dans vos favoris",
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      product: productId,
    });

    // Populate pour la réponse
    await favorite.populate({
      path: "product",
      populate: [
        { path: "universe", select: "name image" },
        { path: "category", select: "name" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Produit ajouté aux favoris",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un produit des favoris
// @route   DELETE /api/favorites/:productId
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Ce produit n'est pas dans vos favoris",
      });
    }

    res.status(200).json({
      success: true,
      message: "Produit retiré des favoris",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vérifier si un produit est en favori
// @route   GET /api/favorites/check/:productId
// @access  Private
export const checkFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favori (ajouter si absent, supprimer si présent)
// @route   PUT /api/favorites/toggle/:productId
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingFavorite) {
      // Supprimer le favori
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return res.status(200).json({
        success: true,
        message: "Produit retiré des favoris",
        isFavorite: false,
      });
    } else {
      // Ajouter le favori
      const favorite = await Favorite.create({
        user: req.user._id,
        product: productId,
      });

      await favorite.populate({
        path: "product",
        populate: [
          { path: "universe", select: "name image" },
          { path: "category", select: "name" },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Produit ajouté aux favoris",
        isFavorite: true,
        data: favorite,
      });
    }
  } catch (error) {
    next(error);
  }
};
