const express = require("express");
const { getUserById } = require("../controller/user");
const router = express.Router();

router.get("/:id", getUserById);
// router.delete('/:id',deleteUserById);
// router.patch('/:id', updateUserById);

exports.router = router;
