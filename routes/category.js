const express = require("express");
const { getCategories, addCategory } = require("../controller/category");

const router = express.Router();

router.post("/brand", addCategory);
router.get("/brand", getCategories);

exports.router = router;
