import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import CategoryModel from "../models/CategoryModel.js";
import SellerModel from "../models/SellerModel.js";
import UserModel from "../models/UserModel.js";

const adminLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email, isAdmin: true });

  if (user && (await user.authenticate(password))) {
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      user: await User.findById(user._id).select("-password"),
      token,
    });
  }

  return res.status(400).json({
    message: "Invalid email or password",
  });
});

const getCategoryAdmin = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const categoryDetail = await CategoryModel.find();
    return res.status(200).json({ categoryDetail });
  } catch (err) {
    console.log("dwb");
    return res.status(400).json({ message: "Something went wrong" });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.body.categoryId;
    const productDetails = await CategoryModel.findById(categoryId).populate(
      "products"
    );
    return res.status(200).json({ productDetails });
  } catch (err) {
    return res.status(400).json({ message: "Invalid Category Id" });
  }
});

const getSellerList = asyncHandler(async (req, res) => {
  try {
    const sellerList = await SellerModel.find()
      .select("-password")
      .select("-isActive");

    return res.status(200).json({ sellerList });
  } catch (err) {
    return res.status(400).json({ message: "No Seller Registered" });
  }
});

const getUsersList = asyncHandler(async (req, res) => {
  try {
    const usersList = await UserModel.find({ isAdmin: false })
      .select("-password")
      .select("-isAdmin")
      .select("-isActive");
    return res.status(200).json({ usersList });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

const getAdminList = asyncHandler(async (req, res) => {
  try {
    const usersList = await UserModel.find({ isAdmin: true })
      .select("-password")
      .select("-isAdmin")
      .select("-isActive");
    return res.status(200).json({ usersList });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

export {
  adminLogin,
  getCategoryAdmin,
  getProducts,
  getAdminList,
  getSellerList,
  getUsersList,
};
