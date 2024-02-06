const express = require("express");
const { getCategories, addCategory } = require("../controller/category");

const router = express.Router();

router.post("/add", addCategory);
router.get("/categories", getCategories);

exports.router = router;
