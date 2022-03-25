import express from "express";
import multer from "multer";
import { body, param, query } from "express-validator";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
} from "../controllers/productControllers.js";
import {
  allowSellerOnly,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();
const upload = multer();

router.post(
  "/",
  [
    authenticateSeller,
    allowSellerOnly,
    body("categoryId")
      .notEmpty()
      .withMessage("categoryId cannot be an empty field")
      .isString(),
    body("name")
      .notEmpty()
      .withMessage("name cannot be an empty field")
      .isString(),
    body("description")
      .notEmpty()
      .withMessage("description cannot be an empty field")
      .isString(),
    body("price")
      .notEmpty()
      .withMessage("price cannot be an empty field")
      .isDecimal(),
    body("stock")
      .notEmpty()
      .withMessage("stock cannot be an empty field")
      .isDecimal(),
  ],
  createProduct
);

router.get(
  "/",
  [
    query("categoryId")
      .notEmpty()
      .withMessage("productId cannot be an empty field")
      .isString(),
  ],
  getProducts
);

router.get(
  "/:productId",
  [
    param("productId")
      .notEmpty()
      .withMessage("productId cannot be an empty")
      .isString(),
  ],
  getProduct
);

router.put(
  "/:productId",
  [
    authenticateSeller,
    allowSellerOnly,
    upload.single("image"),
    param("productId").exists().notEmpty().isString(),
  ],
  editProduct
);

router.delete(
  "/:productId",
  [
    authenticateSeller,
    allowSellerOnly,
    param("productId").exists().notEmpty().isString(),
  ],
  deleteProduct
);

export default router;
