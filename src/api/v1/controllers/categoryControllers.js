import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Business from "../models/BusinessModel.js";
import Category from "../models/CategoryModel.js";
import { uploadFile } from "../config/s3.js";

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

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Image field required",
      });
    }

    // uploading image to s3
    const { Location: image } = await uploadFile(file);

    const category = await Category.create({
      name,
      image,
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
    let image;
    if (req.file) {
      // uploading image to s3
      const file = req.file;
      const { Location } = await uploadFile(file);
      image = Location;
    } else {
      image = category.image;
    }

    const name = req.body.name || category.name;

    category.name = name;
    category.image = image;

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
