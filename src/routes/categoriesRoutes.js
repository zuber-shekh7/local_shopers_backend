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

router.get(
  "/:category_id",
  [param("category_id").exists().notEmpty().isString()],
  getCategory
);

router.put(
  "/:category_id",
  [authenticateSeller, allowSellerOnly],
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

export default router;
