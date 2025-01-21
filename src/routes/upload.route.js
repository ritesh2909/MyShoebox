import express from "express";
import multer from "multer";
import { initializeUpload, handleFileUpload, sendMessageFromClient } from "../controllers/upload.controller.js";



const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/trigger/kafka", sendMessageFromClient);
router.post("/usual", upload.single('file'), handleFileUpload);
router.post("/initialise", initializeUpload);

export default router;