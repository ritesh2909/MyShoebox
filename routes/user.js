const express = require("express");
const userController = require("../controller/user");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.put("/edit-user", verifyToken, userController.updateUser);
router.post("/forgot-password", userController.forgotPasswordOtp);
router.get("/:id", userController.getAUser);
exports.router = router;
