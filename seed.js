import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. CONNEXION
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Connecté à MongoDB...");

    // 2. NETTOYAGE
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log("🧹 Base nettoyée complètement.");

    // 3. CRÉATION DES PRODUITS
    const products = [
      // ========== DRAGON BALL ==========
      {
        name: "Jeu de Pièces 'Saiyans vs Freezer'",
        description:
          "Set de pièces d'échecs représentant les guerriers Saiyans contre l'armée de Freezer.",
        price: 45.99,
        stock: 30,
        image: "/images/products/dbz-pièces-sayan-vs-vilains.jpg",
        universe: "Dragon Ball",
        category: "Pièces d'échec",
      },
      {
        name: "Plateau 'Tenkaichi Budokai'",
        description: "Échiquier inspiré de l'arène du Tenkaichi Budokai.",
        price: 62.99,
        stock: 25,
        image: "/images/products/dbz-plateau-tenkaichi-budokai.jpg",
        universe: "Dragon Ball",
        category: "Échiquier",
      },
      {
        name: "Horloge 'Radar Dragon'",
        description: "Horloge murale design inspirée du radar à Dragon Balls.",
        price: 34.99,
        stock: 40,
        image: "/images/products/dbz-horloge-radar.jpg",
        universe: "Dragon Ball",
        category: "Accessoires",
      },
      {
        name: "Boîte de Rangement 'Capsule Corp'",
        description: "Boîte de rangement aux couleurs de Capsule Corporation.",
        price: 28.99,
        stock: 35,
        image: "/images/products/dbz-boite-capsule-corp.jpg",
        universe: "Dragon Ball",
        category: "Accessoires",
      },
      {
        name: "Set Premium 'Invocation Shenron'",
        description:
          "Édition collector avec échiquier, pièces premium et figurine Shenron.",
        price: 79.99,
        stock: 15,
        image: "/images/products/dbz-set-premium-shenron.jpg",
        universe: "Dragon Ball",
        category: "Échiquier",
      },

      // ========== NARUTO ==========
      {
        name: "Jeu de Pièces 'Volonté du Feu vs Akatsuki'",
        description:
          "Affrontement épique entre les ninjas de Konoha et l'organisation Akatsuki.",
        price: 48.99,
        stock: 28,
        image: "/images/products/naruto-pieces-naruto-vs-akatsuki.jpg",
        universe: "Naruto",
        category: "Pièces d'échec",
      },
      {
        name: "Plateau 'Vallée de la Fin'",
        description:
          "Échiquier représentant le lieu légendaire du combat final entre Naruto et Sasuke.",
        price: 58.99,
        stock: 22,
        image: "/images/products/naruto-plateau-vallee-fin.jpg",
        universe: "Naruto",
        category: "Échiquier",
      },
      {
        name: "Boîte de Rangement 'Parchemin Interdit'",
        description:
          "Boîte en forme de parchemin pour ranger vos pièces d'échecs.",
        price: 26.99,
        stock: 45,
        image: "/images/products/naruto-boite-parchemin.jpg",
        universe: "Naruto",
        category: "Accessoires",
      },
      {
        name: "Horloge 'Sharingan'",
        description: "Horloge murale avec motif Sharingan animé.",
        price: 38.99,
        stock: 32,
        image: "/images/products/naruto-horloge-sharingan.jpg",
        universe: "Naruto",
        category: "Accessoires",
      },
      {
        name: "Pièces 'Kage Summit' (Édition Luxe)",
        description: "Collection premium des 5 Kage avec socles gravés.",
        price: 74.99,
        stock: 18,
        image: "/images/products/naruto-pieces-luxe-kage.jpg",
        universe: "Naruto",
        category: "Pièces d'échec",
      },

      // ========== ONE PIECE ==========
      {
        name: "Plateau 'Carte de Grand Line'",
        description: "Échiquier représentant la carte de Grand Line.",
        price: 56.99,
        stock: 26,
        image: "/images/products/onepiece-plateau-carte-grandline.jpg",
        universe: "One Piece",
        category: "Échiquier",
      },
      {
        name: "Jeu de Pièces 'Mugiwaras vs La Marine'",
        description: "L'équipage du Chapeau de Paille affronte la Marine.",
        price: 52.99,
        stock: 30,
        image: "/images/products/onepiece-pieces-mugiwaras-marine.jpg",
        universe: "One Piece",
        category: "Pièces d'échec",
      },
      {
        name: "Horloge 'Log Pose'",
        description: "Horloge en forme de Log Pose.",
        price: 42.99,
        stock: 24,
        image: "/images/products/onepiece-horloge-log-pose.jpg",
        universe: "One Piece",
        category: "Accessoires",
      },
      {
        name: "Coffre de Rangement 'Berry'",
        description: "Coffre au trésor pour ranger vos pièces.",
        price: 32.99,
        stock: 38,
        image: "/images/products/onepiece-coffre-berry.jpg",
        universe: "One Piece",
        category: "Accessoires",
      },
      {
        name: "Set de Pions 'Fruits du Démon'",
        description: "Pions spéciaux en forme de Fruits du Démon.",
        price: 36.99,
        stock: 35,
        image: "/images/products/onepiece-pions-fruits-demon.jpg",
        universe: "One Piece",
        category: "Accessoires",
      },

      // ========== GHIBLI ==========
      {
        name: "Jeu de Pièces 'Esprits de la Forêt'",
        description:
          "Pièces inspirées des créatures magiques des films du Studio Ghibli.",
        price: 49.99,
        stock: 22,
        image: "/images/products/ghibli-pieces-esprits-foret.jpg",
        universe: "Ghibli",
        category: "Pièces d'échec",
      },
      {
        name: "Plateau 'Le Voyage de Chihiro'",
        description: "Échiquier illustrant les bains de Yubaba.",
        price: 64.99,
        stock: 20,
        image: "/images/products/ghibli-plateau-chihiro.jpg",
        universe: "Ghibli",
        category: "Échiquier",
      },
      {
        name: "Horloge 'Calcifer'",
        description: "Horloge en forme de Calcifer avec LED intégrées.",
        price: 44.99,
        stock: 28,
        image: "/images/products/ghibli-horloge-calcifer.jpg",
        universe: "Ghibli",
        category: "Accessoires",
      },
      {
        name: "Boîte 'Robot de Laputa'",
        description:
          "Boîte de rangement en métal à l'effigie du robot gardien.",
        price: 29.99,
        stock: 32,
        image: "/images/products/ghibli-boite-robot-laputa.jpg",
        universe: "Ghibli",
        category: "Accessoires",
      },
      {
        name: "Set Minimaliste 'Princesse Mononoké'",
        description: "Pièces en bois sculpté inspirées de Princesse Mononoké.",
        price: 68.99,
        stock: 16,
        image: "/images/products/ghibli-pieces-mononoke-bois.jpg",
        universe: "Ghibli",
        category: "Pièces d'échec",
      },

      // ========== DEMON SLAYER ==========
      {
        name: "Boîte de Rangement 'La Boîte de Nezuko'",
        description: "Réplique de la boîte que porte Tanjiro.",
        price: 35.99,
        stock: 40,
        image: "/images/products/demonslayer-boite-nezuko.jpg",
        universe: "Demon Slayer",
        category: "Accessoires",
      },
      {
        name: "Jeu de Pièces 'Piliers vs Lunes Démoniaques'",
        description: "Les 9 Piliers affrontent les Lunes Démoniaques.",
        price: 54.99,
        stock: 25,
        image: "/images/products/demonslayer-pieces-piliers.jpg",
        universe: "Demon Slayer",
        category: "Pièces d'échec",
      },
      {
        name: "Plateau 'Montagne Natagumo'",
        description: "Échiquier sombre inspiré de la forêt des araignées.",
        price: 59.99,
        stock: 20,
        image: "/images/products/demonslayer-plateau-natagumo.jpg",
        universe: "Demon Slayer",
        category: "Échiquier",
      },
      {
        name: "Set de Pièces 'Tanjiro & Nezuko'",
        description: "Pièces spéciales centrées sur les protagonistes.",
        price: 39.99,
        stock: 45,
        image: "/images/products/demonslayer-pieces-tanjiro.jpg",
        universe: "Demon Slayer",
        category: "Pièces d'échec",
      },

      // ========== CROSSOVER / AUTRES ==========
      {
        name: "Échiquier Crossover Anime",
        description: "Échiquier neutre compatible avec tous les univers.",
        price: 69.99,
        stock: 50,
        image: "/images/products/crossover-board.jpg",
        universe: "Naruto",
        category: "Échiquier",
      },
      {
        name: "Pack Découverte Débutant",
        description: "Kit complet pour débuter: échiquier, pièces et guide.",
        price: 119.99,
        stock: 35,
        image: "/images/products/starter-pack.jpg",
        universe: "Naruto",
        category: "Échiquier",
      },
      {
        name: "Pièces Villains Collection",
        description: "Tous les grands méchants des différents univers anime.",
        price: 89.99,
        stock: 18,
        image: "/images/products/villains-pieces.jpg",
        universe: "Naruto",
        category: "Pièces d'échec",
      },
      {
        name: "Sacoche de Transport Premium",
        description: "Sac de transport en cuir synthétique.",
        price: 49.99,
        stock: 45,
        image: "/images/products/premium-bag.jpg",
        universe: "Naruto",
        category: "Accessoires",
      },
      {
        name: "Échiquier LED Customisable",
        description: "Échiquier électronique avec LEDs RGB programmables.",
        price: 199.99,
        stock: 12,
        image: "/images/products/led-board.jpg",
        universe: "Naruto",
        category: "Échiquier",
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits créés.`);

    // 7. CRÉER UN ADMIN
    const adminEmail = process.env.ADMIN_EMAIL || "admin@echecsmangas.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const admin = await User.create({
        prenom: "Admin",
        nom: "Root",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log("🔐 Admin créé:", admin.email);
    } else {
      console.log("🔐 Admin déjà présent:", adminExists.email);
    }

    console.log("✅ Seed terminé avec succès !");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur seed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
