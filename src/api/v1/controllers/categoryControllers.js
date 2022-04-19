import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Business from "../models/BusinessModel.js";
import Category from "../models/CategoryModel.js";
import { deleteFile, uploadFile } from "../config/s3.js";

const getCategories = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const businessId = req.query.businessId;

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({
      messsage: "Invalid business id",
    });
  }

  const business = await Business.findById(businessId).populate("categories");

  if (business) {
    return res.status(200).json({ categories: business.categories });
  }

  return res.status(400).json({
    message: "Invalid business id",
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const businessId = req.body.businessId;

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({
      messsage: "Invalid business id",
    });
  }

  const business = await Business.findById(businessId);

  if (business) {
    const { name } = req.body;

    if (!req.files) {
      return res.status(400).json({
        message: "Photo field required",
      });
    }

    // uploading photos to s3
    const { Key, Location } = await uploadFile(req.files.photo);

    const category = await Category.create({
      name,
      photo: {
        url: Location,
        key: Key,
      },
    });

    business.categories.push(category);
    category.business = business._id;

    await business.save();
    await category.save();

    return res.status(201).json({ category });
  }

  return res.status(400).json({
    messsage: "Invalid business id",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const category = await Category.findById(categoryId).populate([
    "products",
    "business",
  ]);

  if (category) {
    return res.status(200).json({ category });
  }

  return res.status(400).json({
    message: "Invalid category id",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const category = await Category.findById(categoryId);

  if (category) {
    let photo;
    if (req.files) {
      // deleting existing photo from s3
      await deleteFile(category.photo.key);
      // uploading photo to s3
      const { Key, Location } = await uploadFile(req.files.photo);
      photo = { url: Location, key: Key };
    } else {
      photo = category.photo;
    }

    const { name } = req.body;

    await Category.updateOne(
      { _id: category._id },
      {
        name,
        photo,
      }
    );

    return res.status(200).json({ category });
  }

  return res.status(400).json({
    message: "Invalid category id",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const categoryId = req.params.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (category) {
    // deleting photos from s3;
    await deleteFile(category.photo.key);

    return res.status(200).json({ message: "Category deleted successfully" });
  }

  return res.status(400).json({
    message: "Invalid category id",
  });
});

export {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
