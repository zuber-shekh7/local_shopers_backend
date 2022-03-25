import express from "express";
import { query } from "express-validator";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

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

router.post("/", [authenticate], addReview);

export default router;
