import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const userLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await user.authenticate(password))) {
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      user: await User.findById(user._id).select("-password"),
      token,
    });
  }

  return res.status(400).json({
    message: "Invalid email or password",
  });
});

const userSignup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  const existUser = await User.findOne({ email: email });

  if (existUser) {
    res.status(400);
    return res.json({
      message: `User with email ${email} is already exists`,
    });
  }

  const user = await User.create({
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

const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).select("-password");

  if (user) {
    return res.json({
      user,
    });
  }

  return res.status(400).json({ message: "Invalid user id" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { firstName, lastName, email, mobile } = req.body;

  const { id } = req.user;

  const user = await User.findById(id).select("-password");

  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.mobile = mobile;

    await user.save();

    return res.json({
      user,
    });
  }

  return res.status(400).json({ message: "Invalid user id" });
});

export { userLogin, userSignup, getUserProfile, updateUserProfile };
