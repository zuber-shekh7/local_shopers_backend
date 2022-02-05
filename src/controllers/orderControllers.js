import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import User from "../models/UserModel.js";
import Business from "../models/BusinessModel.js";
import Order from "../models/OrderModel.js";

const getUserOrders = asyncHandler(async (req, res) => {
  const { user_id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const orders = await Order.find({ "user._id": user_id });

  return res.json({
    orders,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }

  const {
    user_id,
    business_id,
    orderItems,
    shippingAddress,
    paymentMethod,
    tax,
    shippingCharges,
    totalPrice,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(business_id)) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const user = await User.findById(user_id);
  const business = await Business.findById(business_id);

  if (!user) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  if (!business) {
    return res.status(400).json({
      message: "Invalid business id",
    });
  }

  const order = await Order.create({
    user,
    business,
    orderItems,
    shippingAddress,
    paymentMethod,
    tax,
    shippingCharges,
    totalPrice,
    status: "RECEIVED",
  });

  return res.json({
    order,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const { order_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

  const order = await Order.findById(order_id);

  if (order) {
    return res.json({
      order,
    });
  }

  return res.status(400).json({
    message: "Invalid order id",
  });
});

export { getUserOrders, createOrder, getOrder };
