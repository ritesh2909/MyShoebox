const express = require("express");
const cmsController = require('../controller/cms')

const router = express.Router();

router.get("/sorting-options", cmsController.getSortingOptions);


exports.router = router;