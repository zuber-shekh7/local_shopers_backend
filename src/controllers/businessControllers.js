import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import BusinessCategory from "../models/BusinessCategoryModel.js";
import Business from "../models/BusinessModel.js";

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

const updateBusiness = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const business_id = req.params.business_id;

  const business = await Business.findById(business_id);

  if (business) {
    const name = req.body.name || business.name;
    const description = req.body.description || business.description;
    const category = req.body.category_id || business.category;

    business.name = name;
    business.description = description;
    business.category = category;

    await business.save();

    return res.json({ business });
  }

  return res.status(400).json({
    message: "Invalid business id",
  });
});

export { createBusinessCategory, getBusinessCategories, updateBusiness };
