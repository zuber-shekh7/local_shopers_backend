import express from "express";
import { body, query } from "express-validator";
import { getAddresses } from "../controllers/addressControllers.js";

import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();
router.get(
  "",
  [authenticate, query("user_id").exists().notEmpty().isString()],
  getAddresses
);

export default router;
