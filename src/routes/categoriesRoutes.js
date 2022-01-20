import express from "express";
import { body } from "express-validator";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryControllers.js";
import {
  authenticateSeller,
  allowSellerOnly,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
  "",
  [
    authenticateSeller,
    allowSellerOnly,
    body("business_id").exists().notEmpty().isString(),
  ],
  getCategories
);

router.get(
  "/detail",
  [
    authenticateSeller,
    allowSellerOnly,
    body("category_id").exists().notEmpty().isString(),
  ],
  getCategory
);

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

router.put(
  "",
  [
    authenticateSeller,
    allowSellerOnly,
    body("category_id").exists().notEmpty().isString(),
    body("name").isString(),
  ],
  updateCategory
);

export default router;
