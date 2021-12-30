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
    return res.json({
      message: "User with is already exists",
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

export { userLogin, userSignup };
