import express from "express";
import multer from "multer";
import { initializeUpload, handleFileUpload } from "../controllers/upload.controller.js";


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/usual", upload.single('file'), handleFileUpload);
router.post("/initialise", initializeUpload);

export default router;