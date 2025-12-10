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

    // 2. NETTOYAGE
    await Product.deleteMany({});
    await Universe.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log("🧹 Base nettoyée complètement.");

    // 3. CRÉATION DES CATÉGORIES (Plateaux, Pièces, Accessoires)
    const categoriesData = [
      {
        name: "Pièces",
        description: "Pièces d'échecs individuelles et sets complets",
      },
      {
        name: "Plateaux",
        description: "Échiquiers et plateaux de jeu thématiques",
      },
      {
        name: "Accessoires",
        description: "Pendules, sacs, boîtes de rangement et divers",
      },
    ];
    const createdCategories = await Category.insertMany(categoriesData);
    console.log("✅ Catégories créées : Plateaux, Pièces, Accessoires.");

    // Map pour retrouver facilement les IDs
    const catPieces = createdCategories.find((c) => c.name === "Pièces");
    const catPlateaux = createdCategories.find((c) => c.name === "Plateaux");
    const catAccessoires = createdCategories.find(
      (c) => c.name === "Accessoires"
    );

    // 4. CRÉATION DES UNIVERS (COLLECTIONS)
    const universesData = [
      {
        name: "Dragon Ball",
        description: "L'univers des Saiyans et des guerriers Z",
        image: "/images/universes/dragonball.jpg",
      },
      {
        name: "Naruto",
        description: "L'univers ninja de Konoha et ses villages",
        image: "/images/universes/naruto.jpg",
      },
      {
        name: "One Piece",
        description: "Les aventures de Luffy et son équipage pirate",
        image: "/images/universes/onepiece.jpg",
      },
      {
        name: "Ghibli",
        description: "Les mondes magiques du Studio Ghibli",
        image: "/images/universes/ghibli.jpg",
      },
      {
        name: "Demon Slayer",
        description: "L'univers des pourfendeurs de démons",
        image: "/images/universes/demonslayer.jpg",
      },
    ];
    const createdUniverses = await Universe.insertMany(universesData);
    console.log(
      "✅ Collections créées : Dragon Ball, Naruto, One Piece, Ghibli, Demon Slayer."
    );

    // Map pour retrouver facilement les IDs
    const dragonBall = createdUniverses.find((u) => u.name === "Dragon Ball");
    const naruto = createdUniverses.find((u) => u.name === "Naruto");
    const onePiece = createdUniverses.find((u) => u.name === "One Piece");
    const ghibli = createdUniverses.find((u) => u.name === "Ghibli");
    const demonSlayer = createdUniverses.find((u) => u.name === "Demon Slayer");

    // 5. CRÉATION DES PRODUITS
    const products = [
      // ========== DRAGON BALL ==========
      {
        name: "Jeu de Pièces 'Saiyans vs Freezer'",
        description:
          "Set de pièces d'échecs représentant les guerriers Saiyans contre l'armée de Freezer.",
        price: 45.99,
        stock: 30,
        image: "/images/products/dbz-pièces-sayan-vs-vilains.jpg",
        universe: dragonBall._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Tenkaichi Budokai'",
        description: "Échiquier inspiré de l'arène du Tenkaichi Budokai.",
        price: 62.99,
        stock: 25,
        image: "/images/products/dbz-plateau-tenkaichi-budokai.jpg",
        universe: dragonBall._id,
        category: catPlateaux._id,
      },
      {
        name: "Horloge 'Radar Dragon'",
        description: "Horloge murale design inspirée du radar à Dragon Balls.",
        price: 34.99,
        stock: 40,
        image: "/images/products/dbz-horloge-radar.jpg",
        universe: dragonBall._id,
        category: catAccessoires._id,
      },
      {
        name: "Boîte de Rangement 'Capsule Corp'",
        description: "Boîte de rangement aux couleurs de Capsule Corporation.",
        price: 28.99,
        stock: 35,
        image: "/images/products/dbz-boite-capsule-corp.jpg",
        universe: dragonBall._id,
        category: catAccessoires._id,
      },
      {
        name: "Set Premium 'Invocation Shenron'",
        description:
          "Édition collector avec échiquier, pièces premium et figurine Shenron.",
        price: 79.99,
        stock: 15,
        image: "/images/products/dbz-set-premium-shenron.jpg",
        universe: dragonBall._id,
        category: catPlateaux._id,
      },

      // ========== NARUTO ==========
      {
        name: "Jeu de Pièces 'Volonté du Feu vs Akatsuki'",
        description:
          "Affrontement épique entre les ninjas de Konoha et l'organisation Akatsuki.",
        price: 48.99,
        stock: 28,
        image: "/images/products/naruto-pieces-naruto-vs-akatsuki.jpg",
        universe: naruto._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Vallée de la Fin'",
        description:
          "Échiquier représentant le lieu légendaire du combat final entre Naruto et Sasuke.",
        price: 58.99,
        stock: 22,
        image: "/images/products/naruto-plateau-vallee-fin.jpg",
        universe: naruto._id,
        category: catPlateaux._id,
      },
      {
        name: "Boîte de Rangement 'Parchemin Interdit'",
        description:
          "Boîte en forme de parchemin pour ranger vos pièces d'échecs.",
        price: 26.99,
        stock: 45,
        image: "/images/products/naruto-boite-parchemin.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Horloge 'Sharingan'",
        description: "Horloge murale avec motif Sharingan animé.",
        price: 38.99,
        stock: 32,
        image: "/images/products/naruto-horloge-sharingan.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Pièces 'Kage Summit' (Édition Luxe)",
        description: "Collection premium des 5 Kage avec socles gravés.",
        price: 74.99,
        stock: 18,
        image: "/images/products/naruto-pieces-luxe-kage.jpg",
        universe: naruto._id,
        category: catPieces._id,
      },

      // ========== ONE PIECE ==========
      {
        name: "Plateau 'Carte de Grand Line'",
        description: "Échiquier représentant la carte de Grand Line.",
        price: 56.99,
        stock: 26,
        image: "/images/products/onepiece-plateau-carte-grandline.jpg",
        universe: onePiece._id,
        category: catPlateaux._id,
      },
      {
        name: "Jeu de Pièces 'Mugiwaras vs La Marine'",
        description: "L'équipage du Chapeau de Paille affronte la Marine.",
        price: 52.99,
        stock: 30,
        image: "/images/products/onepiece-pieces-mugiwaras-marine.jpg",
        universe: onePiece._id,
        category: catPieces._id,
      },
      {
        name: "Horloge 'Log Pose'",
        description: "Horloge en forme de Log Pose.",
        price: 42.99,
        stock: 24,
        image: "/images/products/onepiece-horloge-log-pose.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },
      {
        name: "Coffre de Rangement 'Berry'",
        description: "Coffre au trésor pour ranger vos pièces.",
        price: 32.99,
        stock: 38,
        image: "/images/products/onepiece-coffre-berry.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },
      {
        name: "Set de Pions 'Fruits du Démon'",
        description: "Pions spéciaux en forme de Fruits du Démon.",
        price: 36.99,
        stock: 35,
        image: "/images/products/onepiece-pions-fruits-demon.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },

      // ========== GHIBLI ==========
      {
        name: "Jeu de Pièces 'Esprits de la Forêt'",
        description:
          "Pièces inspirées des créatures magiques des films du Studio Ghibli.",
        price: 49.99,
        stock: 22,
        image: "/images/products/ghibli-pieces-esprits-foret.jpg",
        universe: ghibli._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Le Voyage de Chihiro'",
        description: "Échiquier illustrant les bains de Yubaba.",
        price: 64.99,
        stock: 20,
        image: "/images/products/ghibli-plateau-chihiro.jpg",
        universe: ghibli._id,
        category: catPlateaux._id,
      },
      {
        name: "Horloge 'Calcifer'",
        description: "Horloge en forme de Calcifer avec LED intégrées.",
        price: 44.99,
        stock: 28,
        image: "/images/products/ghibli-horloge-calcifer.jpg",
        universe: ghibli._id,
        category: catAccessoires._id,
      },
      {
        name: "Boîte 'Robot de Laputa'",
        description:
          "Boîte de rangement en métal à l'effigie du robot gardien.",
        price: 29.99,
        stock: 32,
        image: "/images/products/ghibli-boite-robot-laputa.jpg",
        universe: ghibli._id,
        category: catAccessoires._id,
      },
      {
        name: "Set Minimaliste 'Princesse Mononoké'",
        description: "Pièces en bois sculpté inspirées de Princesse Mononoké.",
        price: 68.99,
        stock: 16,
        image: "/images/products/ghibli-pieces-mononoke-bois.jpg",
        universe: ghibli._id,
        category: catPieces._id,
      },

      // ========== DEMON SLAYER ==========
      {
        name: "Boîte de Rangement 'La Boîte de Nezuko'",
        description: "Réplique de la boîte que porte Tanjiro.",
        price: 35.99,
        stock: 40,
        image: "/images/products/demonslayer-boite-nezuko.jpg",
        universe: demonSlayer._id,
        category: catAccessoires._id,
      },
      {
        name: "Jeu de Pièces 'Piliers vs Lunes Démoniaques'",
        description: "Les 9 Piliers affrontent les Lunes Démoniaques.",
        price: 54.99,
        stock: 25,
        image: "/images/products/demonslayer-pieces-piliers.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Montagne Natagumo'",
        description: "Échiquier sombre inspiré de la forêt des araignées.",
        price: 59.99,
        stock: 20,
        image: "/images/products/demonslayer-plateau-natagumo.jpg",
        universe: demonSlayer._id,
        category: catPlateaux._id,
      },
      {
        name: "Set de Pièces 'Tanjiro & Nezuko'",
        description: "Pièces spéciales centrées sur les protagonistes.",
        price: 39.99,
        stock: 45,
        image: "/images/products/demonslayer-pieces-tanjiro.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },

      // ========== CROSSOVER / AUTRES ==========
      {
        name: "Échiquier Crossover Anime",
        description: "Échiquier neutre compatible avec tous les univers.",
        price: 69.99,
        stock: 50,
        image: "/images/products/crossover-board.jpg",
        universe: naruto._id,
        category: catPlateaux._id,
      },
      {
        name: "Pack Découverte Débutant",
        description: "Kit complet pour débuter: échiquier, pièces et guide.",
        price: 119.99,
        stock: 35,
        image: "/images/products/starter-pack.jpg",
        universe: naruto._id,
        category: catPlateaux._id,
      },
      {
        name: "Pièces Villains Collection",
        description: "Tous les grands méchants des différents univers anime.",
        price: 89.99,
        stock: 18,
        image: "/images/products/villains-pieces.jpg",
        universe: naruto._id,
        category: catPieces._id,
      },
      {
        name: "Sacoche de Transport Premium",
        description: "Sac de transport en cuir synthétique.",
        price: 49.99,
        stock: 45,
        image: "/images/products/premium-bag.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Échiquier LED Customisable",
        description: "Échiquier électronique avec LEDs RGB programmables.",
        price: 199.99,
        stock: 12,
        image: "/images/products/led-board.jpg",
        universe: naruto._id,
        category: catPlateaux._id,
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
