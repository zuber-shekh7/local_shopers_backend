import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import { uploadFile } from "../config/s3.js";

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const categoryId = req.body.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const category = await Category.findById(categoryId);

  if (category) {
    const { name, description, price, quantity, unit } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Image field required",
      });
    }

    // uploading image to s3
    const { Location: image } = await uploadFile(file);

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      image,
      unit,
    });

    category.products.push(product);
    product.category = category._id;

    await category.save();
    await product.save();

    return res.status(201).json({ product });
  }

  return res.status(400).json({
    message: "Invalid category id",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findById(productId).populate("category");

  if (product) {
    return res.status(200).json({ product });
  }

  return res.status(400).json({
    message: "Invalid product id",
  });
});

const editProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const product_id = req.params.product_id;

  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findById(product_id);

  if (product) {
    const name = req.body.name || product.name;
    const description = req.body.description || product.description;
    const price = req.body.price || product.price;
    const quantity = req.body.quantity;
    const unit = req.body.unit;

    let image;
    if (req.file) {
      // uploading image to s3
      const file = req.file;
      const { Location } = await uploadFile(file);
      image = Location;
    } else {
      image = product.image;
    }

    product.name = name;
    product.description = description;
    product.quantity = quantity;
    product.price = price;
    product.image = image;
    product.unit = unit;

    await product.save();

    return res.status(200).json({ product });
  }

  return res.status(400).json({
    message: "Invalid product id",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const product_id = req.params.product_id;

  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findByIdAndDelete(product_id);

  if (product) {
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  }

  return res.status(400).json({
    message: "Invalid product id",
  });
});

export { createProduct, getProduct, editProduct, deleteProduct };
