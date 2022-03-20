import express from "express";
import { body, query } from "express-validator";
import {
  getAddresses,
  createAddress,
  getAddress,
  editAddress,
  deleteAddress,
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

router.put("/:address_id", [authenticate], editAddress);

router.delete("/:address_id", [authenticate], deleteAddress);

export default router;
