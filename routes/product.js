const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
  getProductByProductId,
  addProductInfo,
  V2getProductsList,
  getProductFilters,
  V2YouMayAlsoLike,
  getProductInfo,
  getProductsUsingFilters,
} = require("../controller/product");

const router = express.Router();

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

exports.router = router;
