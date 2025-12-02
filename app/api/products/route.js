import mongoose from "mongoose";
import { NextResponse } from "next/server";

// On importe tes modèles (Attention aux chemins ../ !)
// Si tes modèles sont à la racine, il faut remonter de 3 niveaux : api > products > app > racine
import Product from "../../../models/Product.js";
import Universe from "../../../models/Universe.js";
import Category from "../../../models/Category.js";

// Fonction pour se connecter (Si pas déjà connecté)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Erreur connexion DB:", error);
  }
};

// Cette fonction gère les requêtes "GET" (Récupérer des infos)
export async function GET() {
  try {
    await connectDB();

    // C'est LA ligne magique : .populate()
    // Elle remplace les ID bizarres par les vrais noms des univers et catégories
    const products = await Product.find({})
      .populate("universe")
      .populate("category");

    // On renvoie les données en format JSON
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
