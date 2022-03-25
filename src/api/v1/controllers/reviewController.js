import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Review from "../models/ReviewModel.js";
import Product from "../models/ProductModel.js";

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

export const addReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const user = req.user.id;
  const { productId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const { name, comment, rating } = req.body;

  const product = await Product.findById(productId).populate("reviews");

  const review = await Review.create({
    name,
    comment,
    rating,
    user,
    product: product._id,
  });

  product.reviews.push(review);

  // calculating ratings
  const ratings = Math.floor(
    product.reviews.reduce((prev, curr) => {
      prev = curr.rating + prev;
      return prev;
    }, 0) / product.reviews.length
  );

  product.noOfReviews = product.reviews.length;
  product.ratings = ratings;

  await product.save();

  return res.json({ review });
});
