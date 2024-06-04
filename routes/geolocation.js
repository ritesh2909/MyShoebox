const express = require("express");
const geoLocationController = require("../controller/geolocation");

const router = express.Router();

router.post("/set-location", geoLocationController.setLocation);
router.get("/location/search", geoLocationController.locationSearch);

exports.router = router;