import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
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
    return res.json(await User.findById(user._id).select("-password"));
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

  return res.json({
    user,
  });
});

export { userLogin, userSignup };
