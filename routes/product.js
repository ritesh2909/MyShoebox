const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
} = require("../controller/product");

const router = express.Router();

router.post("/", addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", updateProductById);

exports.router = router;
