import { Router } from "express";
import * as apiController from "../controllers/api";

const router = Router();

router.get("/", apiController.getPing);

export default router;
