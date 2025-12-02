import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb+srv://nordineaitdb_user:nrz92290%21@cluster0.qyuo0wh.mongodb.net/Cluster0?retryWrites=true&w=majority";

(async () => {
  try {
    const conn = await mongoose.connect(uri, { dbName: 'Cluster0' });
    console.log("✅ Connecté à MongoDB, db:", conn.connection.name);
    const cols = await conn.connection.db.listCollections().toArray();
    console.log("Collections:", cols.map(c => c.name));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur connexion MongoDB:", err.message || err);
    process.exit(1);
  }
})();