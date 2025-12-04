import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Où stocker les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + nom original
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "-");
    cb(null, uniqueName);
  },
});

// Filtrer : accepter seulement les images
const fileFilter = (req, file, cb) => {
  const types = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté (jpg, png, webp seulement)"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});