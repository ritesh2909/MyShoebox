import { Router } from "express";
import { getCategories, addCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/add", addCategory);
router.get("/categories", getCategories);

export default router;