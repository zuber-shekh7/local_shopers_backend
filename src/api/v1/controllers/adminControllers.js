import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import CategoryModel from "../models/CategoryModel.js";
import SellerModel from "../models/SellerModel.js";
import UserModel from "../models/UserModel.js";
import BusinessCategoryModel from "../models/BusinessCategoryModel.js";
import ProductModel from "../models/ProductModel.js";

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
  const categoryDetail = await CategoryModel.find();
  return res.status(200).json({ categoryDetail });
});

const getProducts = asyncHandler(async (req, res) => {
  const categoryId = req.body.categoryId;
  const productDetails = await CategoryModel.findById(categoryId).populate(
    "products"
  );
  return res.status(200).json({ productDetails });
});

const getSellers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const sellers = await SellerModel.find().select("-password");

  return res.status(200).json({ sellers });
});

const getCustomers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const customers = await UserModel.find()
    .select("-password")
    .select("-isAdmin");
  return res.status(200).json({ customers });
});

const getAdminList = asyncHandler(async (req, res) => {
  const usersList = await UserModel.find({ isAdmin: true })
    .select("-password")
    .select("-isAdmin")
    .select("-isActive");
  return res.status(200).json({ usersList });
});

const getBusinessCategory = asyncHandler(async (req, res) => {
  const businessCategory = await BusinessCategoryModel.find();
  return res.status(200).json({ businessCategory });
});

const getStatistics = asyncHandler(async (req, res) => {
  const totalCustomers = await UserModel.countDocuments();
  const totalSellers = await SellerModel.countDocuments();
  const totalProducts = await ProductModel.countDocuments();

  const totalItems = {
    totalCustomers,
    totalProducts,
    totalSellers,
  };

  return res.status(200).json({ totalItems });
});

export {
  adminLogin,
  getCategoryAdmin,
  getProducts,
  getAdminList,
  getSellers,
  getCustomers,
  getStatistics,
  getBusinessCategory,
};
