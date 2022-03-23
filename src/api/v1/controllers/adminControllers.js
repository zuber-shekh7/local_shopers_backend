import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import CategoryModel from "../models/CategoryModel.js";
import SellerModel from "../models/SellerModel.js";
import UserModel from "../models/UserModel.js";
import BusinessCategoryModel from "../models/BusinessCategoryModel.js";
import Admin from "../models/AdminModel.js";
import ProductModel from "../models/ProductModel.js";
import { generateRandomPassword } from "../utils/passwordHelper.js";
import { setCookie } from "../utils/coookieHelper.js";

const adminLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email }).select("password");

  if (admin && (await admin.authenticate(password))) {
    const token = await admin.generateJWTToken();

    setCookie(token, res);

    return res.json({
      admin: await Admin.findById(admin._id),
      token,
    });
  }

  return res.status(400).json({
    message: "Invalid email or password",
  });
});

const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Admin logged out successfully",
  });
});

const addAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { email } = req.body;

  const existAdmin = await Admin.findOne({ email });

  if (existAdmin) {
    return res.status(400).json({
      message: `Admin account for this ${email} is already exists`,
    });
  }

  const password = generateRandomPassword();

  const admin = await Admin.create({
    email,
    password,
  });

  return res.status(201).json({ admin });
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
  adminLogout,
  addAdmin,
  getCategoryAdmin,
  getProducts,
  getAdminList,
  getSellers,
  getCustomers,
  getStatistics,
  getBusinessCategory,
};
