import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import BusinessCategory from "../models/BusinessCategoryModel.js";
import { uploadFile } from "../config/s3.js";

const getBusinessCategories = asyncHandler(async (req, res) => {
  const categories = await BusinessCategory.find();

  return res.json({
    categories,
  });
});

const createBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { name, description } = req.body;

  const existCategory = await BusinessCategory.findOne({
    name: name.toLowerCase(),
  });

  if (existCategory) {
    res.status(400);
    return res.json({
      message: "Business category is already exists",
    });
  }

  // uploading image to s3
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: "Image field is required",
    });
  }

  const { Location: image } = await uploadFile(file);

  const category = await BusinessCategory.create({
    name,
    description,
    image,
  });

  return res.json({
    category,
  });
});

const getBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { businessCategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(businessCategoryId)) {
    return res.status(400).json({
      message: "Invalid business category id",
    });
  }

  const category = await BusinessCategory.findById(businessCategoryId);

  if (category) {
    return res.json({
      category,
    });
  }

  return res.status(400).json({
    message: "Invalid business category id",
  });
});

const editBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { businessCategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(businessCategoryId)) {
    return res.status(400).json({
      message: "Invalid business category id",
    });
  }

  const category = await BusinessCategory.findById(businessCategoryId);

  if (category) {
    const name = req.body.name || category.name;
    const description = req.body.description || category.description;

    let image;
    if (req.file) {
      // uploading image to s3
      const file = req.file;
      const { Location } = await uploadFile(file);
      image = Location;
    } else {
      image = category.image;
    }

    category.name = name;
    category.description = description;
    category.image = image;

    await category.save();

    return res.json({
      category,
    });
  }

  return res.status(400).json({
    message: "Invalid business category id",
  });
});

const deleteBusinessCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { businessCategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(businessCategoryId)) {
    return res.status(400).json({
      message: "Invalid business category id",
    });
  }

  const category = await BusinessCategory.findById(businessCategoryId);

  if (category) {
    await category.delete();

    return res.json({
      message: "Business category delete successfully",
    });
  }

  return res.status(400).json({
    message: "Invalid business category id",
  });
});

export {
  getBusinessCategories,
  createBusinessCategory,
  getBusinessCategory,
  editBusinessCategory,
  deleteBusinessCategory,
};
