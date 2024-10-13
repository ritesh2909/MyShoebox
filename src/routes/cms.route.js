import { Router } from "express";
import { getSortingOptions } from '../controllers/cms.controller.js';

const router = Router();

router.get("/sorting-options", getSortingOptions);


export default router;