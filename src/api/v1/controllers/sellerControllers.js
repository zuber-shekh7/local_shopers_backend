import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Seller from "../models/SellerModel.js";
import mongoose from "mongoose";

const sellerLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // validating input
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { email, password } = req.body;

  const seller = await Seller.findOne({ email: email });

  // authenticating seller
  if (seller && (await seller.authenticate(password))) {
    const token = await seller.generateJWTToken();

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

  // validating input
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { email, password } = req.body;

  const existSeller = await Seller.findOne({ email: email });

  // checking for existing seller
  if (existSeller) {
    res.status(400);
    return res.json({
      message: `Seller with email ${email} is already exists`,
    });
  }

  // creating new seller
  const seller = await Seller.create({
    email,
    password,
  });

  return res.status(201).json({
    seller: await Seller.findById(seller._id).select("-password"),
    token: await seller.generateJWTToken(),
  });
});

const getSeller = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ errorr: msg });
  }

  const id = req.params.sellerId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    return res.json({
      message: "Invalid seller id",
    });
  }

  const seller = await Seller.findById(id)
    .populate("business")
    .select("-password");

  if (seller) {
    return res.json({
      seller,
    });
  }

  return res.status(400).json({
    message: "Invalid seller id",
  });
});

const googleAuthentication = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const token = req.body.token;
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });

  const {
    email,
    email_verified,
    given_name: firstName,
    family_name: lastName,
  } = ticket.getPayload();

  if (email_verified) {
    const existSeller = await Seller.findOne({ email: email }).select(
      "-password"
    );

    if (existSeller) {
      const token = jwt.sign(
        { id: existSeller._id, isSeller: true },
        process.env.SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.json({ token, seller: existSeller });
    }

    const password = email + process.env.SECRET;
    const seller = await Seller.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = jwt.sign(
      { id: seller._id, isSeller: true },
      process.env.SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.json({
      token,
      seller: await Seller.findById(seller._id).select("-password"),
    });
  }

  return res.status(400).json({
    message: "Your email address in not verified, please verify you email.",
  });
});

const updateSeller = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // validating input
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const id = req.params.sellerId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "invalid seller id",
    });
  }

  const seller = await Seller.findById(id).select("-password");

  if (seller) {
    seller.firstName = req.body.firstName || seller.firstName;
    seller.lastName = req.body.lastName || seller.lastName;
    seller.email = req.body.email || seller.email;
    seller.mobile = req.body.mobile || seller.mobile;

    await seller.save();

    return res.json({
      seller,
    });
  }

  return res.status(400).json({ message: "Invalid seller id" });
});

export {
  sellerLogin,
  sellerSignup,
  googleAuthentication,
  getSeller,
  updateSeller,
};
