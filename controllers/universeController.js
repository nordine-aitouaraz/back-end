import Product from "../models/Product.js";

// @desc    Récupérer tous les univers
// @route   GET /api/universes
// @access  Public
export const getAllUniverses = async (req, res, next) => {
  try {
    // Liste statique des univers
    const universes = [
      { _id: "Dragon Ball", name: "Dragon Ball", description: "L'univers des Saiyans et des guerriers Z", image: "/images/universes/dragonball.jpg" },
      { _id: "Naruto", name: "Naruto", description: "L'univers ninja de Konoha et ses villages", image: "/images/universes/naruto.jpg" },
      { _id: "One Piece", name: "One Piece", description: "Les aventures de Luffy et son équipage pirate", image: "/images/universes/onepiece.jpg" },
      { _id: "Ghibli", name: "Ghibli", description: "Les mondes magiques du Studio Ghibli", image: "/images/universes/ghibli.jpg" },
      { _id: "Demon Slayer", name: "Demon Slayer", description: "L'univers des pourfendeurs de démons", image: "/images/universes/demonslayer.jpg" },
    ];

    res.status(200).json({
      success: true,
      count: universes.length,
      data: universes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un univers par ID
// @route   GET /api/universes/:id
// @access  Public
export const getUniverseById = async (req, res, next) => {
  try {
    const universeName = req.params.id;
    const universes = [
      { _id: "Dragon Ball", name: "Dragon Ball", description: "L'univers des Saiyans et des guerriers Z", image: "/images/universes/dragonball.jpg" },
      { _id: "Naruto", name: "Naruto", description: "L'univers ninja de Konoha et ses villages", image: "/images/universes/naruto.jpg" },
      { _id: "One Piece", name: "One Piece", description: "Les aventures de Luffy et son équipage pirate", image: "/images/universes/onepiece.jpg" },
      { _id: "Ghibli", name: "Ghibli", description: "Les mondes magiques du Studio Ghibli", image: "/images/universes/ghibli.jpg" },
      { _id: "Demon Slayer", name: "Demon Slayer", description: "L'univers des pourfendeurs de démons", image: "/images/universes/demonslayer.jpg" },
    ];

    const universe = universes.find(u => u.name === universeName);

    if (!universe) {
      return res.status(404).json({
        success: false,
        message: "Univers non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: universe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les produits d'un univers
// @route   GET /api/universes/:id/products
// @access  Public
export const getProductsByUniverse = async (req, res, next) => {
  try {
    const universeName = req.params.id;
    
    const products = await Product.find({ universe: universeName });

    res.status(200).json({
      success: true,
      universe: universeName,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouvel univers
// @route   POST /api/universes
// @access  Private
export const createUniverse = async (req, res, next) => {
  res.status(400).json({ success: false, message: "Les univers sont statiques." });
};

// @desc    Mettre à jour un univers
// @route   PUT /api/universes/:id
// @access  Private
export const updateUniverse = async (req, res, next) => {
  res.status(400).json({ success: false, message: "Les univers sont statiques." });
};

// @desc    Supprimer un univers
// @route   DELETE /api/universes/:id
// @access  Private
export const deleteUniverse = async (req, res, next) => {
  res.status(400).json({ success: false, message: "Les univers sont statiques." });
};
  } catch (error) {
    next(error);
  }
};
