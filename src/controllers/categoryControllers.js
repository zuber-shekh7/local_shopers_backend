import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Business from "../models/BusinessModel.js";
import Category from "../models/CategoryModel.js";

const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const business_id = req.body.business_id;

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

  const category_id = req.body.category_id;

  const category = await Category.findById(category_id).populate("products");

  if (category) {
    return res.status(201).json({ category });
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

  const category_id = req.body.category_id;

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

export { createCategory, updateCategory, getCategory };