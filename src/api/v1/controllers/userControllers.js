import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { OAuth2Client } from "google-auth-library";
import { validationResult } from "express-validator";

import User from "../models/UserModel.js";
import { setCookie } from "../utils/coookieHelper.js";

const userLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // validating user inputs
  if (!errors.isEmpty()) {
    res.status(400);
    const { msg } = errors.array()[0];
    return res.json({ error: msg });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("password");

  // validating user
  if (user && (await user.authenticate(password))) {
    const token = await user.generateJWTToken();

    setCookie(token, res);

    return res.status(200).json({
      user: await User.findById(user._id),
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

  const token = await user.generateJWTToken();

  setCookie(token, res);

  return res.status(200).json({
    user: await User.findById(user._id),
    token,
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
  const id = req.params.userId;

  // validating userId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "invalid user id",
    });
  }

  const user = await User.findById(id).select("-password");

  if (user) {
    // updating user fields
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

  // validating inputs
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const token = req.body.token;
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

  // validating token and generating ticket
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
      const token = await existuser.generateJWTToken();
      return res.json({ token, user: existuser });
    }

    // creating password for google auth user
    const password = email + process.env.SECRET;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = await user.generateJWTToken();

    return res.json({
      user: await User.findById(user._id).select("-password"),
      token,
    });
  }

  return res.status(400).json({
    message:
      "Your email address in not verified, please verify you email with google.",
  });
});

const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "User logged out successfully",
  });
});

export {
  userLogin,
  userSignup,
  getUser,
  updateUser,
  googleAuthentication,
  userLogout,
};
