import express from "express";
import { query } from "express-validator";
import { getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.get(
  "/",
  [
    query("productId")
      .notEmpty()
      .withMessage("productId cannot be an empty field")
      .isString()
      .withMessage("productId must a string"),
  ],
  getReviews
);

export default router;
