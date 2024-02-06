const express = require("express");
const { getBrands, addBrand } = require("../controller/brand");

const router = express.Router();

router.post("/new", addBrand);
router.get("/brand", getBrands);

exports.router = router;
