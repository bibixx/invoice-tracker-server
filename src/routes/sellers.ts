import { Router } from "express";

const router = Router();

import * as sellersController from "../controllers/sellers";
import authenticate from "../auth/authentication";

router.use("/", authenticate);
router.get("/", sellersController.getSellers);
router.post("/", ...sellersController.postSellers);
router.put("/:id", ...sellersController.putSellers);
router.delete("/:id", ...sellersController.deleteSellers);

export default router;
