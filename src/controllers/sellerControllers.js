import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";

const sellerLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email: email, isSeller: true });

  if (user && (await user.authenticate(password))) {
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, isSeller: user.isSeller },
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

export { sellerLogin };
