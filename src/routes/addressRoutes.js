import express from "express";
import { body, query } from "express-validator";
import {
  getAddresses,
  createAddress,
  getAddress,
} from "../controllers/addressControllers.js";

import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
  "",
  [authenticate, query("user_id").exists().notEmpty().isString()],
  getAddresses
);

router.post(
  "",
  [
    authenticate,
    body("user_id").exists().notEmpty().isString(),
    body("fullName").exists().notEmpty().isString(),
    body("mobileNumber").exists().notEmpty().isString(),
    body("pincode").exists().notEmpty().isString(),
    body("flatNo").exists().notEmpty().isString(),
    body("city").exists().notEmpty().isString(),
    body("state").exists().notEmpty().isString(),
  ],
  createAddress
);

router.get("/:address_id", [authenticate], getAddress);

export default router;
