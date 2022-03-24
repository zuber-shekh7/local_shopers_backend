import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { validationResult } from "express-validator";

import User from "../models/UserModel.js";
import { setCookie } from "../utils/coookieHelper.js";
import { sentEmail } from "../utils/mailHelper.js";

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

  // userId validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "invalid user id",
    });
  }

  const user = await User.findById(id);

  if (user) {
    // updating user fields
    const { firstName, lastName, gender, dob } = req.body;

    const profile = {
      firstName,
      lastName,
      gender,
      dob,
    };

    user.profile = profile;

    await user.save();

    return res.json({
      user,
    });
  }

  return res.status(400).json({ message: "Invalid user id" });
});

const googleAuthentication = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
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

    // checking for existing user
    if (existuser) {
      const token = await existuser.generateJWTToken();
      setCookie(token, res);
      return res.json({ token, user: existuser });
    }

    // creating password for google auth user
    const password = email + process.env.SECRET;

    const user = await User.create({
      email,
      password,
      profile: {
        firstName,
        lastName,
      },
    });

    const token = await user.generateJWTToken();

    setCookie(token, res);

    return res.json({
      user: await User.findById(user._id),
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

const changePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res.status(400).json({
      message:
        "New password and old password are same. Please enter different new password.",
    });
  }

  const user = await User.findById(req.user.id).select("password");

  if (user && (await user.authenticate(oldPassword))) {
    user.password = newPassword;
    await user.save();

    const token = await user.generateJWTToken();
    setCookie(token, res);

    return res.json({ message: "Password changed successfully." });
  }

  return res.status(400).json({
    message: "Incorrect old password. Please enter correct password",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: `${email} is not registered email.`,
    });
  }

  const token = user.generateForgotPasswordToken();

  await user.save();

  const forgotPasswordLink = `${process.env.FORGOT_PASSWORD_LINK}/${token}`;

  const text = `Reset Password Link\n\nCopy the following link, paste in your browser and hit enter.\n\nLink: ${forgotPasswordLink}`;

  const subject = "Local Shoppers Reset Password Link";

  try {
    await sentEmail(user.email, subject, text);
    return res.json({
      message: "Email sent successfully. Please check your inbox.",
    });
  } catch (err) {
    console.error(err.message);

    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(500).json({
      message: "Failed to sent email. Please try again later.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const { password } = req.body;

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: `Invalid or expired token.`,
    });
  }

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");
  crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryptToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: `Invalid or expired token.`,
    });
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;

  await user.save();

  return res.json({
    message: "Password reset successfully.",
  });
});

export {
  userLogin,
  userSignup,
  getUser,
  updateUser,
  googleAuthentication,
  userLogout,
  changePassword,
  forgotPassword,
  resetPassword,
};
