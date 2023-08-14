const express = require("express");
const { registerUser, loginUser } = require("../controller/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

exports.router = router;
