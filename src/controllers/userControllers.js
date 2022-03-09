import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { validationResult } from "express-validator";

import User from "../models/UserModel.js";

const userLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // validating user inputs
  if (!errors.isEmpty()) {
    res.status(400);
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  // validating user
  if (user && (await user.authenticate(password))) {
    const token = await user.generateJWTToken();

    return res.status(200).json({
      user: await User.findById(user._id).select("-password"),
      token,
    });
  }

  return res.status(401).json({
    message: "Invalid email or password",
  });
});

const userSignup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // validating user inputs
  if (!errors.isEmpty()) {
    res.status(400);
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  // checking for existing user
  if (existingUser) {
    return res.status(401).json({
      message: `User with email ${email} is already exists`,
    });
  }

  const user = await User.create({
    email,
    password,
  });

  res.status(201);
  return res.json({
    user: await User.findById(user._id).select("-password"),
  });
});

const getUser = asyncHandler(async (req, res) => {
  const id = req.params.userId;

  // validating userId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "invalid user id",
    });
  }

  const user = await User.findById(id).select("-password");

  if (user) {
    return res.json({
      user,
    });
  }

  return res.status(400).json({ message: "Invalid user id" });
});

const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const id = req.params.user_id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "invalid user id",
    });
  }

  const user = await User.findById(id).select("-password");

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    await user.save();

    return res.json({
      user,
    });
  }

  return res.status(400).json({ message: "Invalid user id" });
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
    const existuser = await User.findOne({ email: email }).select("-password");

    if (existuser) {
      const token = jwt.sign(
        { id: existuser._id, isAdmin: existuser.isAdmin },
        process.env.SECRET,
        { expiresIn: "30d" }
      );

      return res.json({ token, user: existuser });
    }

    const password = email + process.env.SECRET;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      token,
      user: await User.findById(user._id).select("-password"),
    });
  }

  return res.status(400).json({
    message: "Your email address in not verified, please verify you email.",
  });
});

export { userLogin, userSignup, getUser, updateUser, googleAuthentication };
