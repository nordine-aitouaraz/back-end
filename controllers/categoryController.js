import Product from "../models/Product.js";

// @desc    Récupérer toutes les catégories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    // Liste statique des catégories
    const categories = [
      { _id: "Échiquier", name: "Échiquier" },
      { _id: "Pièces d'échec", name: "Pièces d'échec" },
      { _id: "Accessoires", name: "Accessoires" },
    ];

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une catégorie par ID (Nom)
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const categoryName = req.params.id;
    const validCategories = ["Échiquier", "Pièces d'échec", "Accessoires"];

    if (!validCategories.includes(categoryName)) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: { _id: categoryName, name: categoryName },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les produits d'une catégorie
// @route   GET /api/categories/:id/products
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const categoryName = req.params.id;

    const products = await Product.find({ category: categoryName }).populate(
      "universe",
      "name"
    );

    res.status(200).json({
      success: true,
      category: categoryName,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle catégorie
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  res
    .status(400)
    .json({ success: false, message: "Les catégories sont statiques." });
};

// @desc    Mettre à jour une catégorie
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  res
    .status(400)
    .json({ success: false, message: "Les catégories sont statiques." });
};

// @desc    Supprimer une catégorie
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  res
    .status(400)
    .json({ success: false, message: "Les catégories sont statiques." });
};
