import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import { deleteFile, uploadFile } from "../config/s3.js";

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  // file validation
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "Please upload photos" });
  }

  const categoryId = req.body.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const category = await Category.findById(categoryId);

  if (category) {
    const {
      name,
      description,
      price,
      discountPrice,
      discount,
      qty,
      unit,
      stock,
    } = req.body;

    // uploading image to s3
    const { Key, Location } = await uploadFile(req.files.photos, "photos");

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      discount,
      qty,
      unit,
      stock,
      photos: {
        key: Key,
        url: Location,
      },
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

const getProducts = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const categoryId = req.query.categoryId;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  const products = await Product.find({ category: categoryId });

  return res.status(200).json({ products });
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
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findById(productId);

  if (product) {
    const { name, description, price, stock } = req.body;

    let photos = [];
    if (req.files) {
      // deleting existing phtos
      for (let photo of product.photos) {
        await deleteFile(photo.key);
      }
      // uploading new photos
      const { Key, Location } = await uploadFile(req.files.photos, "photos");
      photos.push({ url: Location, key: Key });
    } else {
      photos = product.photos;
    }

    await Product.updateOne(
      { _id: productId },
      {
        name,
        description,
        price,
        stock,
        photos,
      }
    );

    return res.status(200).json({ product });
  }

  return res.status(400).json({
    message: "Invalid product id",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
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

  const product = await Product.findByIdAndDelete(productId);

  if (product) {
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  }

  return res.status(400).json({
    message: "Invalid product id",
  });
});

export { createProduct, getProduct, getProducts, editProduct, deleteProduct };
