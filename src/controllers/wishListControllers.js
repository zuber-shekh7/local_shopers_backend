import User from "../models/UserModel.js";
import WishList from "../models/WishListModel.js";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Product from "../models/ProductModel.js";

const getWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const id = req.query.user_id;

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
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const wish_list_id = req.body.wish_list_id;
  const product_id = req.body.product_id;

  if (!mongoose.Types.ObjectId.isValid(wish_list_id)) {
    return res.status(400).json({
      message: "Invalid wish list id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const wishList = await WishList.findById(wish_list_id).populate("products");

  if (wishList) {
    const existProduct = await wishList.products.filter((product) => {
      if (product._id.toString() === product_id) {
        return product;
      }
    });

    if (existProduct.length > 0) {
      return res.json({
        message: "Product already added to wishlist",
      });
    }

    const product = await Product.findById(product_id);

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
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const wish_list_id = req.body.wish_list_id;
  const product_id = req.body.product_id;

  if (!mongoose.Types.ObjectId.isValid(wish_list_id)) {
    return res.status(400).json({
      message: "Invalid wish list id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const wishList = await WishList.findById(wish_list_id).populate("products");

  if (wishList) {
    const product = await Product.findById(product_id);

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
