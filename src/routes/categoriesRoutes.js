import express from "express";
import { body, query, param } from "express-validator";
import {
  createCategory,
  deleteCategory,
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
    query("business_id").exists().notEmpty().isString(),
  ],
  getCategories
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

router.delete(
  "/:category_id",
  [
    authenticateSeller,
    allowSellerOnly,
    param("category_id").exists().notEmpty().isString(),
  ],
  deleteCategory
);

router.get(
  "/:category_id",
  [
    authenticateSeller,
    allowSellerOnly,
    param("category_id").exists().notEmpty().isString(),
  ],
  getCategory
);
export default router;
