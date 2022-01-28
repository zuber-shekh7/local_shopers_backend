import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import BusinessCategory from "../models/BusinessCategoryModel.js";

const getBusinessCategories = asyncHandler(async (req, res) => {
  const categories = await BusinessCategory.find();

  return res.json({
    categories,
  });
});

const createBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { name, description } = req.body;

  const existCategory = await BusinessCategory.findOne({ name: name });

  if (existCategory) {
    res.status(400);
    return res.json({
      message: "Business Category is already exists",
    });
  }

  const category = await BusinessCategory.create({
    name,
    description,
  });

  return res.json({
    category,
  });
});

const getBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { category_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category_id)) {
    return res.status(400).json({
      message: "Invalid business category id",
    });
  }

  const category = await BusinessCategory.findById(category_id);

  if (category) {
    return res.json({
      category,
    });
  }

  return res.status(400).json({
    message: "Invalid business category id",
  });
});

export { getBusinessCategories, createBusinessCategory, getBusinessCategory };
