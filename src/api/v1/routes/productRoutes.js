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
    upload.single("image"),
    body("categoryId").exists().notEmpty().isString(),
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
    body("price").exists().notEmpty().isDecimal(),
    body("quantity").exists().notEmpty().isDecimal(),
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
