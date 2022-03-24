import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Address from "../models/AddressModel.js";
import User from "../models/UserModel.js";

const getAddresses = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const userId = req.query.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(userId).populate("addresses");

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

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const userId = req.body.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findById(userId);

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
      user,
    });

    user.addresses.push(address);
    await user.save();

    return res.status(201).json({ address });
  }

  return res.status(400).json({
    message: "Invalid user id",
  });
});

const getAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(addressId);

  if (address) {
    return res.status(200).json({ address });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});

const editAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(addressId);

  if (address) {
    const fullName = req.body.fullName || address.fullName;
    const mobileNumber = req.body.mobileNumber || address.mobileNumber;
    const flatNo = req.body.flatNo || address.flatNo;
    const city = req.body.city || address.city;
    const state = req.body.state || address.state;
    const landmark = req.body.landmark || address.landmark;
    const street = req.body.street || address.street;
    const pincode = req.body.pincode || address.pincode;

    address.fullName = fullName;
    address.mobileNumber = mobileNumber;
    address.flatNo = flatNo;
    address.city = city;
    address.state = state;
    address.landmark = landmark;
    address.street = street;
    address.pincode = pincode;

    await address.save();

    return res.status(200).json({ address });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  // input validation
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json({ error: msg });
  }

  const addressId = req.params.addressId;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: "Invalid address id",
    });
  }

  const address = await Address.findById(addressId);

  if (address) {
    const user = await User.findById(address.user._id);

    await user.addresses.pull(address);
    await address.delete();
    await user.save();

    return res.status(200).json({ message: "Address deleted successfully" });
  }

  return res.status(400).json({
    message: "Invalid address id",
  });
});

export { getAddresses, createAddress, getAddress, editAddress, deleteAddress };
