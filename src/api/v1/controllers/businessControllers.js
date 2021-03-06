import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import BusinessCategory from "../models/BusinessCategoryModel.js";
import Business from "../models/BusinessModel.js";
import mongoose from "mongoose";
import Seller from "../models/SellerModel.js";
import { uploadFile } from "../config/s3.js";

const createBusiness = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { name, description, businessCategoryId } = req.body;

  const { id } = req.seller;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    return res.json({
      message: "Invalid seller id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(businessCategoryId)) {
    res.status(400);
    return res.json({
      message: "Invalid business category id",
    });
  }

  const seller = await Seller.findById(id);

  if (!seller) {
    res.status(400);
    return res.json({
      message: "Invalid seller id",
    });
  }

  if (seller && seller.business) {
    res.status(400);
    return res.json({
      message: "Business is already exists",
    });
  }

  const category = await BusinessCategory.findById(businessCategoryId);

  if (!category) {
    return res.status(400).json({
      message: "Invalid Business Category id",
    });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: "Image field required",
    });
  }

  // uploading image to s3
  const { Location: image } = await uploadFile(file);

  const business = await Business.create({
    name,
    description,
    category,
    image,
  });

  seller.business = business._id;
  await seller.save();

  return res.status(201).json({
    business: await Business.findById(business._id).populate("category"),
  });
});

const getBusiness = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const businessId = req.params.businessId;

  const business = await Business.findById(businessId).populate([
    "category",
    "categories",
  ]);

  if (business) {
    return res.json({
      business,
    });
  }

  return res.status(400).json({
    message: "Invalid business id",
  });
});

const updateBusiness = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const businessId = req.params.businessId;

  const business = await Business.findById(businessId);

  if (business) {
    const name = req.body.name || business.name;
    const description = req.body.description || business.description;
    const category = req.body.categoryId || business.category;

    let image;
    if (req.file) {
      // uploading image to s3
      const file = req.file;
      const { Location } = await uploadFile(file);
      image = Location;
    } else {
      image = business.image;
    }

    business.name = name;
    business.description = description;
    business.category = category;
    business.image = image;

    await business.save();

    return res.json({ business });
  }

  return res.status(400).json({
    message: "Invalid business id",
  });
});

export { createBusiness, getBusiness, updateBusiness };
