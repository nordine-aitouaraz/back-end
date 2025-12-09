import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// =====================
// ROUTES UTILISATEUR
// =====================

// @desc    Créer une commande
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, shippingCost = 0 } = req.body;

    // Vérifier l'adresse de livraison
    if (!shippingAddress || !shippingAddress.nom || !shippingAddress.adresse || !shippingAddress.ville || !shippingAddress.codePostal) {
      return res.status(400).json({
        success: false,
        message: "Adresse de livraison incomplète",
      });
    }

    // Récupérer le panier
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Votre panier est vide",
      });
    }

    // Vérifier le stock et préparer les items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      });

      // Décrémenter le stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculer les totaux
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shippingCost;

    // Créer la commande
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
      status: "confirmed",
      paymentStatus: "paid", // Simulé pour l'instant
    });

    // Vider le panier
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer mes commandes
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une commande par ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    // Vérifier que c'est bien la commande de l'utilisateur (ou admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =====================
// ROUTES ADMIN
// =====================

// @desc    Récupérer toutes les commandes (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "nom prenom email")
      .populate("items.product", "name image");

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'une commande (Admin)
// @route   PATCH /api/orders/admin/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    // Mettre à jour les champs
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    // Si annulé, remettre le stock
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Commande mise à jour",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques des commandes (Admin)
// @route   GET /api/orders/admin/stats
// @access  Admin
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};