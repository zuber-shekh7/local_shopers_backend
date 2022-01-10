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

  const category = await BusinessCategory.create({
    name,
    description,
  });

  return res.json({
    category,
  });
});

export { createBusinessCategory, getBusinessCategories };
