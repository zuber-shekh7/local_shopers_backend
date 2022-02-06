import express from "express";
import multer from "multer";
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
const upload = multer();

router.post(
  "/",
  [
    authenticateSeller,
    allowSellerOnly,
    upload.single("image"),
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
  [param("product_id").exists().notEmpty().isString()],
  getProduct
);

router.put(
  "/:product_id",
  [
    authenticateSeller,
    allowSellerOnly,
    upload.single("image"),
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
