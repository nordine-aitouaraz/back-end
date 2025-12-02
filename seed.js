import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Universe from "./models/Universe.js";
import Category from "./models/Category.js";
import User from "./models/User.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. CONNEXION
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Connecté à MongoDB...");

    // 2. NETTOYAGE (ne pas supprimer les users)
    await Product.deleteMany({});
    await Universe.deleteMany({});
    await Category.deleteMany({});
    console.log("🧹 Base nettoyée (products/universes/categories).");

    // 3. CRÉATION DES UNIVERS (exemple)
    await Universe.create({
      name: "Naruto",
      description: "L'univers ninja de Konoha et ses villages",
      image: "/images/universes/naruto.jpg",
    });
    await Universe.create({
      name: "One Piece",
      description: "Les aventures de Luffy et son équipage pirate",
      image: "/images/universes/onepiece.jpg",
    });
    await Universe.create({
      name: "Dragon Ball Z",
      description: "Les combattants Saiyans et guerriers Z",
      image: "/images/universes/dbz.jpg",
    });
    await Universe.create({
      name: "Attack on Titan",
      description: "L'humanité face aux Titans",
      image: "/images/universes/aot.jpg",
    });
    console.log("✅ Univers créés.");

    // 4. CREER UN ADMIN (idempotent)
    const adminPhone = process.env.ADMIN_PHONE || "0700000000";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminExists = await User.findOne({ telephone: adminPhone });

    if (!adminExists) {
      const admin = await User.create({
        nom: "Admin",
        prenom: "Root",
        telephone: adminPhone,
        password: adminPassword, // hashé par le pre('save') du modèle
        role: "admin",
      });
      console.log("🔐 Admin créé:", admin.telephone);
    } else {
      console.log("🔐 Admin déjà présent:", adminExists.telephone);
    }

    console.log("✅ Seed terminé.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur seed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
