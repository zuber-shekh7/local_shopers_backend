import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import Seller from "../models/SellerModel.js";

const sellerLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const seller = await Seller.findOne({ email: email, isSeller: true });

  if (seller && (await seller.authenticate(password))) {
    const token = jwt.sign(
      { id: seller._id, isAdmin: seller.isAdmin },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      seller: await Seller.findById(seller._id).select("-password"),
      token,
    });
  }

  return res.status(400).json({
    message: "Invalid email or password",
  });
});

const sellerSignup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  const existSeller = await Seller.findOne({ email: email });

  if (existSeller) {
    res.status(400);
    return res.json({
      message: `Seller with email ${email} is already exists`,
    });
  }

  await Seller.create({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(201);
  return res.json({
    message: "Account Created Successfully",
  });
});

export { sellerLogin, sellerSignup };
