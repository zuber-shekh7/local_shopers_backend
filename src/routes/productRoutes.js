import express from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
} from "../controllers/productControllers.js";
import {
  allowSellerOnly,
  authenticateSeller,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post(
  "/new",
  [
    authenticateSeller,
    allowSellerOnly,
    body("category_id").exists().notEmpty().isString(),
    body("name").exists().notEmpty().isString(),
    body("description").exists().notEmpty().isString(),
    body("price").exists().notEmpty().isDecimal(),
    body("quantity").exists().notEmpty().isDecimal(),
  ],
  createProduct
);

router.get(
  "/:product_id",
  [
    authenticateSeller,
    allowSellerOnly,
    param("product_id").exists().notEmpty().isString(),
  ],
  getProduct
);

router.put(
  "/:product_id/edit",
  [
    authenticateSeller,
    allowSellerOnly,
    param("product_id").exists().notEmpty().isString(),
  ],
  editProduct
);

router.delete(
  "/:product_id",
  [
    authenticateSeller,
    allowSellerOnly,
    param("product_id").exists().notEmpty().isString(),
  ],
  deleteProduct
);

export default router;
