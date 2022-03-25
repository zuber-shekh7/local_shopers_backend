import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Review from "../models/ReviewModel.js";

export const getReviews = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { productId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const reviews = await Review.find({ product: productId });

  return res.json({ reviews });
});
