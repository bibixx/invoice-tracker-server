import { Router } from "express";

const router = Router();

import * as sellersController from "../controllers/sellers";
import * as sellersControllerNew from "../Seller/seller.controller";
import authenticate from "../auth/authentication";

router.use("/", authenticate);
router.get("/", sellersControllerNew.getSellers);
router.get("/:sellerId", sellersControllerNew.getSellerById);
router.post("/", ...sellersController.postSellers);
router.put("/:id", ...sellersController.putSellers);
router.delete("/:id", ...sellersController.deleteSellers);

export default router;
