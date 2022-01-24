import express from "express";
import { query } from "express-validator";
import { getWishList } from "../controllers/wishListControllers.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
  "/",
  [authenticate, query("user_id").exists().notEmpty().isString()],
  getWishList
);

export default router;
