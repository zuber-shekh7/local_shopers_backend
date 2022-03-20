import User from "../models/UserModel.js";
import WishList from "../models/WishListModel.js";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Product from "../models/ProductModel.js";

const getWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const id = req.query.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(id).populate("wishList");

  if (user) {
    if (user.wishList) {
      return res.json({
        wishList: await WishList.findById(user.wishList._id).populate(
          "products"
        ),
      });
    }

    const wishList = await WishList.create({});
    user.wishList = wishList;
    user.save();

    return res.json({
      wishList: await WishList.findById(wishList._id).populate("products"),
    });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

const addToWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const wishlistId = req.body.wishlistId;
  const productId = req.body.productId;

  if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
    return res.status(400).json({
      message: "Invalid wishlist id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const wishList = await WishList.findById(wishlistId).populate("products");

  if (wishList) {
    const existProduct = await wishList.products.filter((product) => {
      if (product._id.toString() === productId) {
        return product;
      }
    });

    if (existProduct.length > 0) {
      return res.json({
        message: "Product already added to wishlist",
      });
    }

    const product = await Product.findById(productId);

    if (product) {
      wishList.products.push(product);
      wishList.save();
      return res.json({ wishList });
    }

    return res.status(400).json({
      message: "Invalid wish list id",
    });
  }

  return res.status(400).json({
    message: "Invalid wish list id",
  });
});

const removeFromWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const wishlistId = req.body.wishlistId;
  const productId = req.body.productId;

  if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
    return res.status(400).json({
      message: "Invalid wish list id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const wishList = await WishList.findById(wishlistId).populate("products");

  if (wishList) {
    const product = await Product.findById(productId);

    if (product) {
      wishList.products.pull(product);
      wishList.save();
      return res.json({ wishList });
    }

    return res.status(400).json({
      message: "Invalid wish list id",
    });
  }

  return res.status(400).json({
    message: "Invalid wish list id",
  });
});

export { getWishList, addToWishList, removeFromWishList };
