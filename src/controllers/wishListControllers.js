import User from "../models/UserModel.js";
import WishList from "../models/WishListModel.js";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const getWishList = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const id = req.query.user_id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(id).populate("wishList");

  if (user) {
    if (user.wishList) {
      return res.json({ wishList: user.wishList });
    }

    const wishList = await WishList.create({});
    user.wishList = wishList;
    user.save();

    return res.json({ wishList });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

export { getWishList };
