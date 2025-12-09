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
    await User.deleteMany({}); // Nettoyer aussi les users
    console.log("🧹 Base nettoyée complètement.");

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

    // 4. CRÉATION DES UNIVERS
    await Universe.create({
      name: "Dragon Ball",
      description: "L'univers des Saiyans et des guerriers Z",
      image: "/images/universes/dragonball.jpg",
    });
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
      name: "Ghibli",
      description: "Les mondes magiques du Studio Ghibli",
      image: "/images/universes/ghibli.jpg",
    });
    await Universe.create({
      name: "Demon Slayer",
      description: "L'univers des pourfendeurs de démons de Kimetsu no Yaiba",
      image: "/images/universes/demonslayer.jpg",
    });
    console.log("✅ Univers créés.");

    // 5. RÉCUPÉRATION DES IDs POUR LES RELATIONS
    const dragonBall = await Universe.findOne({ name: "Dragon Ball" });
    const naruto = await Universe.findOne({ name: "Naruto" });
    const onePiece = await Universe.findOne({ name: "One Piece" });
    const ghibli = await Universe.findOne({ name: "Ghibli" });
    const demonSlayer = await Universe.findOne({ name: "Demon Slayer" });

    const catPieces = await Category.findOne({ name: "Pièces d'échecs" });
    const catEchiquiers = await Category.findOne({ name: "Échiquiers" });
    const catAccessoires = await Category.findOne({ name: "Accessoires" });
    const catCollectors = await Category.findOne({ name: "Collectors" });

    // 6. CRÉATION DES PRODUITS
    const products = [
      // ========== DRAGON BALL ==========
      {
        name: "Jeu de Pièces 'Saiyans vs Freezer'",
        description:
          "Set de pièces d'échecs représentant les guerriers Saiyans contre l'armée de Freezer. Détails sculptés de haute qualité.",
        price: 45.99,
        stock: 30,
        image: "/images/products/dbz-pièces-sayan-vs-vilains.jpg",
        universe: dragonBall._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Tenkaichi Budokai'",
        description:
          "Échiquier inspiré de l'arène du Tenkaichi Budokai, le plus grand tournoi d'arts martiaux.",
        price: 62.99,
        stock: 25,
        image: "/images/products/dbz-plateau-tenkaichi-budokai.jpg",
        universe: dragonBall._id,
        category: catEchiquiers._id,
      },
      {
        name: "Horloge 'Radar Dragon'",
        description:
          "Horloge murale design inspirée du radar à Dragon Balls. Parfait pour décorer votre espace geek.",
        price: 34.99,
        stock: 40,
        image: "/images/products/dbz-horloge-radar.jpg",
        universe: dragonBall._id,
        category: catAccessoires._id,
      },
      {
        name: "Boîte de Rangement 'Capsule Corp'",
        description:
          "Boîte de rangement aux couleurs de Capsule Corporation pour stocker vos pièces d'échecs.",
        price: 28.99,
        stock: 35,
        image: "/images/products/dbz-boite-capsule-corp.jpg",
        universe: dragonBall._id,
        category: catAccessoires._id,
      },
      {
        name: "Set Premium 'Invocation Shenron'",
        description:
          "Édition collector avec échiquier, pièces premium et figurine Shenron. Coffret luxe numéroté.",
        price: 79.99,
        stock: 15,
        image: "/images/products/dbz-set-premium-shenron.jpg",
        universe: dragonBall._id,
        category: catCollectors._id,
      },

      // ========== NARUTO ==========
      {
        name: "Jeu de Pièces 'Volonté du Feu vs Akatsuki'",
        description:
          "Affrontement épique entre les ninjas de Konoha et l'organisation Akatsuki. Pièces détaillées et peintes à la main.",
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
        category: catEchiquiers._id,
      },
      {
        name: "Boîte de Rangement 'Parchemin Interdit'",
        description:
          "Boîte en forme de parchemin pour ranger vos pièces d'échecs avec style ninja.",
        price: 26.99,
        stock: 45,
        image: "/images/products/naruto-boite-parchemin.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Horloge 'Sharingan'",
        description:
          "Horloge murale avec motif Sharingan animé. Les aiguilles représentent les tomoe.",
        price: 38.99,
        stock: 32,
        image: "/images/products/naruto-horloge-sharingan.jpg",
        universe: naruto._id,
        category: catAccessoires._id,
      },
      {
        name: "Pièces 'Kage Summit' (Édition Luxe)",
        description:
          "Collection premium des 5 Kage avec socles gravés. Édition limitée avec certificat d'authenticité.",
        price: 74.99,
        stock: 18,
        image: "/images/products/naruto-pieces-luxe-kage.jpg",
        universe: naruto._id,
        category: catCollectors._id,
      },

      // ========== ONE PIECE ==========
      {
        name: "Plateau 'Carte de Grand Line'",
        description:
          "Échiquier représentant la carte de Grand Line avec ses différentes îles et routes.",
        price: 56.99,
        stock: 26,
        image: "/images/products/onepiece-plateau-carte-grandline.jpg",
        universe: onePiece._id,
        category: catEchiquiers._id,
      },
      {
        name: "Jeu de Pièces 'Mugiwaras vs La Marine'",
        description:
          "L'équipage du Chapeau de Paille affronte la Marine. Pièces sculptées avec soin.",
        price: 52.99,
        stock: 30,
        image: "/images/products/onepiece-pieces-mugiwaras-marine.jpg",
        universe: onePiece._id,
        category: catPieces._id,
      },
      {
        name: "Horloge 'Log Pose'",
        description:
          "Horloge en forme de Log Pose, l'outil de navigation indispensable sur Grand Line.",
        price: 42.99,
        stock: 24,
        image: "/images/products/onepiece-horloge-log-pose.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },
      {
        name: "Coffre de Rangement 'Berry'",
        description:
          "Coffre au trésor pour ranger vos pièces, décoré avec le symbole des Berry.",
        price: 32.99,
        stock: 38,
        image: "/images/products/onepiece-coffre-berry.jpg",
        universe: onePiece._id,
        category: catAccessoires._id,
      },
      {
        name: "Set de Pions 'Fruits du Démon'",
        description:
          "Pions spéciaux en forme de Fruits du Démon. Parfait pour personnaliser vos parties.",
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
          "Pièces inspirées des créatures magiques des films du Studio Ghibli. Design poétique et enchanteur.",
        price: 49.99,
        stock: 22,
        image: "/images/products/ghibli-pieces-esprits-foret.jpg",
        universe: ghibli._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Le Voyage de Chihiro'",
        description:
          "Échiquier illustrant les bains de Yubaba et l'univers onirique du Voyage de Chihiro.",
        price: 64.99,
        stock: 20,
        image: "/images/products/ghibli-plateau-chihiro.jpg",
        universe: ghibli._id,
        category: catEchiquiers._id,
      },
      {
        name: "Horloge 'Calcifer' (Le Château Ambulant)",
        description:
          "Horloge en forme de Calcifer, le démon de feu du Château Ambulant. LED intégrées.",
        price: 44.99,
        stock: 28,
        image: "/images/products/ghibli-horloge-calcifer.jpg",
        universe: ghibli._id,
        category: catAccessoires._id,
      },
      {
        name: "Boîte 'Robot de Laputa'",
        description:
          "Boîte de rangement en métal à l'effigie du robot gardien de Laputa.",
        price: 29.99,
        stock: 32,
        image: "/images/products/ghibli-boite-robot-laputa.jpg",
        universe: ghibli._id,
        category: catAccessoires._id,
      },
      {
        name: "Set Minimaliste 'Princesse Mononoké'",
        description:
          "Pièces en bois sculpté inspirées de Princesse Mononoké. Design épuré et élégant.",
        price: 68.99,
        stock: 16,
        image: "/images/products/ghibli-pieces-mononoke-bois.jpg",
        universe: ghibli._id,
        category: catCollectors._id,
      },

      // ========== DEMON SLAYER ==========
      {
        name: "Boîte de Rangement 'La Boîte de Nezuko'",
        description:
          "Réplique de la boîte que porte Tanjiro pour transporter Nezuko. Parfaite pour ranger vos pièces.",
        price: 35.99,
        stock: 40,
        image: "/images/products/demonslayer-boite-nezuko.jpg",
        universe: demonSlayer._id,
        category: catAccessoires._id,
      },
      {
        name: "Jeu de Pièces 'Piliers vs Lunes Démoniaques'",
        description:
          "Affrontement entre les 9 Piliers et les Lunes Démoniaques. Finitions premium avec détails impressionnants.",
        price: 54.99,
        stock: 24,
        image: "/images/products/demonslayer-pieces-piliers-vs-lunes.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },
      {
        name: "Plateau 'Tatami Infini'",
        description:
          "Échiquier avec design de tatami japonais traditionnel inspiré du Manoir de l'Infini.",
        price: 59.99,
        stock: 20,
        image: "/images/products/demonslayer-plateau-tatami.jpg",
        universe: demonSlayer._id,
        category: catEchiquiers._id,
      },
      {
        name: "Horloge 'Garde de Katana' (Tsuba)",
        description:
          "Horloge murale en forme de tsuba (garde de sabre) avec motifs traditionnels japonais.",
        price: 39.99,
        stock: 30,
        image: "/images/products/demonslayer-horloge-tsuba.jpg",
        universe: demonSlayer._id,
        category: catAccessoires._id,
      },
      {
        name: "Pièces 'Masques de Forgerons'",
        description:
          "Collection de pièces représentant les forgerons de sabres avec leurs masques emblématiques.",
        price: 46.99,
        stock: 26,
        image: "/images/products/demonslayer-pieces-masques-forgerons.jpg",
        universe: demonSlayer._id,
        category: catPieces._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits créés.`);

    // 7. CRÉER UN ADMIN avec le nouveau schéma (email)
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
