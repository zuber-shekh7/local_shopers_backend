import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Business from "../models/BusinessModel.js";
import Category from "../models/CategoryModel.js";

const getCategories = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const business_id = req.query.business_id;

  if (!mongoose.Types.ObjectId.isValid(business_id)) {
    return res.status(400).json({
      messsage: "Invalid business id",
    });
  }

  const business = await Business.findById(business_id).populate("categories");

  if (business) {
    return res.status(201).json({ categories: business.categories });
  }

  return res.status(400).json({
    messsage: "Invalid business id",
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const business_id = req.body.business_id;

  if (!mongoose.Types.ObjectId.isValid(business_id)) {
    return res.status(400).json({
      messsage: "Invalid business id",
    });
  }

  const business = await Business.findById(business_id);

  if (business) {
    const name = req.body.name;

    const category = await Category.create({
      name,
    });

    business.categories.push(category);

    await business.save();

    return res.status(201).json({ category });
  }

  return res.status(400).json({
    messsage: "Invalid business id",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const category_id = req.params.category_id;

  if (!mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({
      messsage: "Invalid category id",
    });
  }

  const category = await Category.findById(category_id).populate("products");

  if (category) {
    return res.status(200).json({ category });
  }

  return res.status(400).json({
    messsage: "Invalid category id",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const category_id = req.params.category_id;

  if (!mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({
      messsage: "Invalid category id",
    });
  }

  const category = await Category.findById(category_id);

  if (category) {
    const name = req.body.name || category.name;

    category.name = name;

    await category.save();

    return res.status(201).json({ category });
  }

  return res.status(400).json({
    messsage: "Invalid category id",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const category_id = req.params.category_id;

  if (!mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({
      messsage: "Invalid category id",
    });
  }

  const category = await Category.findByIdAndDelete(category_id);

  if (category) {
    return res.status(200).json({ message: "Category Deleted Successfully" });
  }

  return res.status(400).json({
    messsage: "Invalid category id",
  });
});

export {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
