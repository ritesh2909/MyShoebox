import { Router } from "express";
import { setLocation, locationSearch } from "../controllers/geolocation.controller.js";

const router = Router();

router.post("/set-location", setLocation);
router.get("/location/search", locationSearch);

export default router;