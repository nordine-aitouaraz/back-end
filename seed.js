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

    // 3. CRÉATION DES CATÉGORIES
    await Category.create([
      {
        name: "Pièces d'échecs",
        description: "Pièces individuelles et sets complets",
      },
      { name: "Échiquiers", description: "Plateaux et échiquiers thématiques" },
      {
        name: "Accessoires",
        description: "Pendules, sacs, boîtes de rangement",
      },
      { name: "Collectors", description: "Éditions limitées et collectors" },
    ]);
    console.log("✅ Catégories créées.");

    // 4. CRÉATION DES UNIVERS (exemple)
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
    await Universe.create({
      name: "Demon Slayer",
      description: "L'univers des pourfendeurs de démons de Kimetsu no Yaiba",
      image: "/images/universes/demonslayer.jpg",
    });
    console.log("✅ Univers créés.");

    // 5. RÉCUPÉRATION DES IDs POUR LES RELATIONS
    const naruto = await Universe.findOne({ name: "Naruto" });
    const onePiece = await Universe.findOne({ name: "One Piece" });
    const dbz = await Universe.findOne({ name: "Dragon Ball Z" });
    const aot = await Universe.findOne({ name: "Attack on Titan" });
    const demonSlayer = await Universe.findOne({ name: "Demon Slayer" });

    const catPieces = await Category.findOne({ name: "Pièces d'échecs" });
    const catEchiquiers = await Category.findOne({ name: "Échiquiers" });
    const catAccessoires = await Category.findOne({ name: "Accessoires" });
    const catCollectors = await Category.findOne({ name: "Collectors" });

    // 6. CRÉATION DES PRODUITS
    const products = [
      // NARUTO
      {
        name: "Échiquier Konoha Deluxe",
        description:
          "Échiquier aux couleurs du village de Konoha avec finitions premium",
        price: 89.99,
        stock: 25,
        image: "/images/products/naruto-konoha-board.jpg",
        universe: naruto._id,
        category: catEchiquiers._id,
      },
      {
        name: "Échiquier Akatsuki Édition Limitée",
        description:
          "Échiquier sombre avec le logo Akatsuki, édition numérotée",
        price: 129.99,
        stock: 10,
        image: "/images/products/naruto-akatsuki-board.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },
      {
        name: "Pièces Équipe 7",
        description:
          "Set de pièces représentant Naruto, Sasuke, Sakura et Kakashi",
        price: 49.99,
        stock: 40,
        image: "/images/products/naruto-team7-pieces.jpg",
        universe: naruto._id,
        category: catPieces._id,
      },
      {
        name: "Pièces Hokage Legends",
        description: "Collection de pièces des 7 Hokages de Konoha",
        price: 69.99,
        stock: 30,
        image: "/images/products/naruto-hokage-pieces.jpg",
        universe: naruto._id,
        category: catPieces._id,
      },
      {
        name: "Boîte de Rangement Naruto",
        description: "Boîte en bois gravée avec symbole du village de Konoha",
        price: 34.99,
        stock: 50,
        image: "/images/products/naruto-storage-box.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Pièces Bronze Vintage Naruto",
        description:
          "Pièces en bronze vieilli représentant les personnages emblématiques",
        price: 159.99,
        stock: 8,
        image: "/images/products/naruto-bronze-pieces.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },

      // ONE PIECE
      {
        name: "Échiquier Going Merry",
        description: "Échiquier en forme du premier navire de Luffy",
        price: 99.99,
        stock: 20,
        image: "/images/products/onepiece-merry-board.jpg",
        universe: onePiece._id,
        category: catEchiquiers._id,
      },
      {
        name: "Échiquier Grand Line Map",
        description: "Échiquier avec carte de Grand Line intégrée",
        price: 79.99,
        stock: 35,
        image: "/images/products/onepiece-grandline-board.jpg",
        universe: onePiece._id,
        category: catEchiquiers._id,
      },
      {
        name: "Pièces Équipage Chapeau de Paille",
        description:
          "Set complet avec Luffy, Zoro, Nami, Sanji et tout l'équipage",
        price: 59.99,
        stock: 45,
        image: "/images/products/onepiece-crew-pieces.jpg",
        universe: onePiece._id,
        category: catPieces._id,
      },
      {
        name: "Pièces Empereurs et Amiraux",
        description: "Collection des Yonko et Amiraux de la Marine",
        price: 89.99,
        stock: 22,
        image: "/images/products/onepiece-emperors-pieces.jpg",
        universe: onePiece._id,
        category: catPieces._id,
      },
      {
        name: "Horloge d'Échecs One Piece",
        description:
          "Pendule d'échecs avec design One Piece et son du Gong Gong",
        price: 44.99,
        stock: 30,
        image: "/images/products/onepiece-clock.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },

      // DRAGON BALL Z
      {
        name: "Échiquier Cell Games Arena",
        description: "Échiquier reproduisant l'arène du Cell Game",
        price: 94.99,
        stock: 18,
        image: "/images/products/dbz-cellgames-board.jpg",
        universe: dbz._id,
        category: catEchiquiers._id,
      },
      {
        name: "Échiquier Capsule Corp",
        description: "Échiquier moderne aux couleurs de Capsule Corporation",
        price: 84.99,
        stock: 28,
        image: "/images/products/dbz-capsulecorp-board.jpg",
        universe: dbz._id,
        category: catEchiquiers._id,
      },
      {
        name: "Pièces Guerriers Z",
        description: "Goku, Vegeta, Gohan, Piccolo et les héros de la Terre",
        price: 54.99,
        stock: 55,
        image: "/images/products/dbz-zwarriors-pieces.jpg",
        universe: dbz._id,
        category: catPieces._id,
      },
      {
        name: "Pièces Saga Freezer",
        description: "Set incluant Freezer, Ginyu Force et les transformations",
        price: 64.99,
        stock: 32,
        image: "/images/products/dbz-freezer-pieces.jpg",
        universe: dbz._id,
        category: catPieces._id,
      },
      {
        name: "Tapis de Jeu DBZ",
        description: "Tapis néoprène représentant la planète Namek",
        price: 29.99,
        stock: 60,
        image: "/images/products/dbz-playmat.jpg",
        universe: dbz._id,
        category: catAccessoires._id,
      },

      // ATTACK ON TITAN
      {
        name: "Échiquier Murs de l'Humanité",
        description: "Échiquier circulaire représentant les trois murs",
        price: 109.99,
        stock: 15,
        image: "/images/products/aot-walls-board.jpg",
        universe: aot._id,
        category: catEchiquiers._id,
      },
      {
        name: "Échiquier Bataillon d'Exploration",
        description: "Design militaire avec les ailes de la liberté",
        price: 89.99,
        stock: 24,
        image: "/images/products/aot-scout-board.jpg",
        universe: aot._id,
        category: catEchiquiers._id,
      },
      {
        name: "Pièces Eren vs Annie",
        description: "Set représentant le combat des Titans",
        price: 74.99,
        stock: 20,
        image: "/images/products/aot-eren-annie-pieces.jpg",
        universe: aot._id,
        category: catPieces._id,
      },
      {
        name: "Pièces Escouade Livaï",
        description: "Livaï, Erwin, Hanji et l'élite du Bataillon",
        price: 69.99,
        stock: 28,
        image: "/images/products/aot-levi-squad-pieces.jpg",
        universe: aot._id,
        category: catPieces._id,
      },
      {
        name: "Porte-Pièces Attack on Titan",
        description: "Support en métal avec logo gravé des ailes de la liberté",
        price: 39.99,
        stock: 35,
        image: "/images/products/aot-piece-holder.jpg",
        universe: aot._id,
        category: catAccessoires._id,
      },

      // DEMON SLAYER
      {
        name: "Échiquier Montagnes de Kimetsu",
        description: "Échiquier inspiré des montagnes où s'entraîne Tanjiro",
        price: 92.99,
        stock: 22,
        image: "/images/products/ds-mountain-board.jpg",
        universe: demonSlayer._id,
        category: catEchiquiers._id,
      },
      {
        name: "Échiquier Manoir des Papillons",
        description: "Design élégant du manoir de Shinobu Kocho",
        price: 99.99,
        stock: 16,
        image: "/images/products/ds-butterfly-board.jpg",
        universe: demonSlayer._id,
        category: catEchiquiers._id,
      },
      {
        name: "Pièces Piliers Hashira",
        description: "Les 9 Piliers de l'armée des pourfendeurs de démons",
        price: 79.99,
        stock: 26,
        image: "/images/products/ds-hashira-pieces.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },
      {
        name: "Pièces Tanjiro & Nezuko",
        description: "Set centré sur les héros principaux et leurs alliés",
        price: 54.99,
        stock: 40,
        image: "/images/products/ds-tanjiro-nezuko-pieces.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },
      {
        name: "Livre de Notation Demon Slayer",
        description: "Carnet de notation avec motifs traditionnels japonais",
        price: 19.99,
        stock: 70,
        image: "/images/products/ds-notation-book.jpg",
        universe: demonSlayer._id,
        category: catAccessoires._id,
      },

      // CROSSOVER / MULTI-UNIVERS (on utilise Naruto comme univers par défaut)
      {
        name: "Échiquier Crossover Anime",
        description: "Échiquier neutre compatible avec tous les univers",
        price: 69.99,
        stock: 50,
        image: "/images/products/crossover-board.jpg",
        universe: naruto._id,
        category: catEchiquiers._id,
      },
      {
        name: "Pack Découverte Débutant",
        description: "Kit complet pour débuter: échiquier, pièces et guide",
        price: 119.99,
        stock: 35,
        image: "/images/products/starter-pack.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },
      {
        name: "Pièces Villains Collection",
        description: "Tous les grands méchants des différents univers anime",
        price: 89.99,
        stock: 18,
        image: "/images/products/villains-pieces.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },
      {
        name: "Sacoche de Transport Premium",
        description:
          "Sac de transport en cuir synthétique pour échiquier et pièces",
        price: 49.99,
        stock: 45,
        image: "/images/products/premium-bag.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Échiquier LED Customisable",
        description: "Échiquier électronique avec LEDs RGB programmables",
        price: 199.99,
        stock: 12,
        image: "/images/products/led-board.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits créés.`);

    // 7. CREER UN ADMIN (idempotent)
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
