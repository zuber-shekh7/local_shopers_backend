import express from "express";
import multer from "multer";
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
const upload = multer();

router.get(
  "",
  [
    authenticateSeller,
    allowSellerOnly,
    query("businessId").exists().notEmpty().isString(),
  ],
  getCategories
);

router.post(
  "/",
  [
    authenticateSeller,
    allowSellerOnly,
    body("businessId")
      .notEmpty()
      .withMessage("businessId cannot be an empty field")
      .isString()
      .withMessage("businessId must be a string value"),
    body("name")
      .notEmpty()
      .withMessage("name cannot be an empty field")
      .isString()
      .withMessage("name must be a string value"),
  ],
  createCategory
);

router.get(
  "/:categoryId",
  [param("categoryId").exists().notEmpty().isString()],
  getCategory
);

router.put(
  "/:categoryId",
  [
    authenticateSeller,
    allowSellerOnly,
    body("name")
      .notEmpty()
      .withMessage("name cannot be an empty field")
      .isString()
      .withMessage("name must be a string value"),
  ],
  updateCategory
);

router.delete(
  "/:categoryId",
  [
    authenticateSeller,
    allowSellerOnly,
    param("categoryId").exists().notEmpty().isString(),
  ],
  deleteCategory
);

export default router;
