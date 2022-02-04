import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";

const getUserOrders = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

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
  return res.json({
    message: "Order created successfully",
  });
});

export { getUserOrders, createOrder };
