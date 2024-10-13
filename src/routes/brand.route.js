import { Router } from "express";
import { getBrands, addBrand } from "../controllers/brand.controller.js";

const router = Router();

router.post("/new", addBrand);
router.get("/brand", getBrands);

export default router;
