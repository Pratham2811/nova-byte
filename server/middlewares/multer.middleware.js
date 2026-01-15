// middlewares/multer.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { ObjectId } from "mongodb";

// Ensure storage directory exists
const STORAGE_ROOT = path.resolve("storage2");

if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, STORAGE_ROOT);
  },

  filename(req, file, cb) {
    const id = new ObjectId().toHexString();
    const ext = path.extname(file.originalname).toLowerCase();

    // Attach metadata (safe, request-scoped)
    file.generatedId = id;
    file.extension = ext;

    cb(null, `${id}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    
    files: 10,
  },
 
});
