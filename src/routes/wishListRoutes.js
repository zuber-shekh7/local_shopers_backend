import express from "express";
import { body, query } from "express-validator";
import {
  addToWishList,
  getWishList,
  removeFromWishList,
} from "../controllers/wishListControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
  "/",
  [authenticate, query("userId").exists().notEmpty().isString()],
  getWishList
);

router.post(
  "/",
  [
    authenticate,
    body("wishlistId").exists().notEmpty().isString(),
    body("productId").exists().notEmpty().isString(),
  ],
  addToWishList
);

router.delete(
  "/",
  [
    authenticate,
    body("wishlistId").exists().notEmpty().isString(),
    body("productId").exists().notEmpty().isString(),
  ],
  removeFromWishList
);

export default router;
