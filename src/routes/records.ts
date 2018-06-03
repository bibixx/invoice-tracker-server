import { Router } from "express";
import passport from "passport";
import authenticate from "../auth/authentication";
import * as recordsController from "../controllers/records";

const router = Router();

router.use("/", authenticate);
router.get("/", recordsController.getRecords);

export default router;
