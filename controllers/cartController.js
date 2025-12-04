import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Récupérer le panier de l'utilisateur
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart) {
      cart = { items: [], total: 0 };
    } else {
      // Calculer le total
      cart = cart.toObject();
      cart.total = cart.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un produit au panier
// @route   POST /api/cart/:productId
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    // Vérifier le stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock insuffisant",
      });
    }

    // Trouver ou créer le panier
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Vérifier si le produit est déjà dans le panier
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Mettre à jour la quantité
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Ajouter le nouveau produit
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Retourner le panier mis à jour
    cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.status(200).json({
      success: true,
      message: "Produit ajouté au panier",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Modifier la quantité d'un produit
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantité invalide",
      });
    }

    // Vérifier le stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock insuffisant",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier non trouvé",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé dans le panier",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.status(200).json({
      success: true,
      message: "Quantité mise à jour",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un produit du panier
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier non trouvé",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.status(200).json({
      success: true,
      message: "Produit retiré du panier",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vider le panier
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "Panier vidé",
      data: { items: [], total: 0 },
    });
  } catch (error) {
    next(error);
  }
};