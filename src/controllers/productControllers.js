import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const category_id = req.body.category_id;

  const category = await Category.findById(category_id);

  if (category) {
    const { name, description, price } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
    });

    category.products.push(product);

    await category.save();

    return res.status(201).json({ product });
  }

  return res.state(400).json({
    message: "Invalid category id",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const product_id = req.params.product_id;

  const product = await Product.findById(product_id);

  if (product) {
    return res.status(200).json({ product });
  }

  return res.state(400).json({
    message: "Invalid product id",
  });
});

export { createProduct, getProduct };
