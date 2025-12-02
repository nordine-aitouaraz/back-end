// Middleware pour gérer les erreurs de manière centralisée

const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur:", err.message);

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors,
    });
  }

  // Erreur CastError (ID invalide)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID invalide",
    });
  }

  // Erreur de duplication (clé unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Ce ${field} existe déjà`,
    });
  }

  // Erreur générique
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur serveur",
  });
};

export default errorHandler;
