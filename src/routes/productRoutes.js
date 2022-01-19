import express from "express";
import { body } from "express-validator";
import { createProduct } from "../controllers/productControllers.js";
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
  ],
  createProduct
);

export default router;
