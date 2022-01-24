import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Address from "../models/AddressModel.js";
import User from "../models/UserModel.js";

const getAddresses = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const user_id = req.query.user_id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(user_id);

  if (user) {
    const addresses = user.addresses;

    return res.status(200).json({ addresses: addresses ? addresses : [] });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

const createAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const user_id = req.body.user_id;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(user_id);

  if (user) {
    const {
      fullName,
      mobileNumber,
      pincode,
      flatNo,
      city,
      state,
      street,
      landmark,
    } = req.body;

    const address = await Address.create({
      fullName,
      mobileNumber,
      pincode,
      flatNo,
      city,
      state,
      street,
      landmark,
    });

    user.addresses.push(address);
    await user.save();

    return res.status(201).json({ address });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});
export { getAddresses, createAddress };
