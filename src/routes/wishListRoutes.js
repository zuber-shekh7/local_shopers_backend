import express from "express";
import { body, query } from "express-validator";
import {
  addToWishList,
  getWishList,
} from "../controllers/wishListControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
  "/",
  [authenticate, query("user_id").exists().notEmpty().isString()],
  getWishList
);

router.post(
  "/add",
  [
    authenticate,
    body("wish_list_id").exists().notEmpty().isString(),
    body("product_id").exists().notEmpty().isString(),
  ],
  addToWishList
);

export default router;