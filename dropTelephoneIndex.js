import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function dropTelephoneIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    try {
      await db.collection('users').dropIndex('telephone_1');
      console.log('✅ Index telephone_1 supprimé');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Index telephone_1 n\'existe pas');
      } else {
        throw error;
      }
    }
    
    console.log('\nIndex restants:');
    const indexes = await db.collection('users').indexes();
    indexes.forEach(idx => console.log(' -', idx.name));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

dropTelephoneIndex();
