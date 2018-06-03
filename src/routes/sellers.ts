import { Router } from "express";

const router = Router();
import passport from "passport";

import * as sellersController from "../controllers/sellers";
import authenticate from "../auth/authentication";

router.use("/", authenticate);
router.get("/", sellersController.getSellers);
router.post("/", ...sellersController.postSellers);

export default router;
