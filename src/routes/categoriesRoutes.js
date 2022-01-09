import express from "express";
import { body } from "express-validator";
import { createCategory } from "../controllers/categoryControllers.js";
import {
  authenticateSeller,
  allowSellerOnly,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post(
  "/new",
  [
    authenticateSeller,
    allowSellerOnly,
    body("business_id").exists().notEmpty().isString(),
    body("name").exists().notEmpty().isString(),
  ],
  createCategory
);

export default router;
