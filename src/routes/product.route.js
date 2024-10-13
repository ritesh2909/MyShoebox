import { Router } from "express";
import { getProductsUsingFilters, getProductFilters, addProduct, addProductInfo, getProducts, V2getProductsList, getProductById, getProductByProductId, updateProductById, V2YouMayAlsoLike, getProductInfo, } from "../controllers/product.controller.js";

const router = Router();

router.post("/products", getProductsUsingFilters);
router.post("/filters", getProductFilters);
router.post("/add", addProduct);
router.post("/addproductinfo", addProductInfo);
router.get("/", getProducts);
router.get("/home-page-products", V2getProductsList);
router.get("/:id", getProductById);
router.get("/productId/:productId", getProductByProductId);
router.patch("/:id", updateProductById);
router.get("/you-may-also-like/:productId", V2YouMayAlsoLike);
router.post("/get-product-info", getProductInfo);


export default router;
