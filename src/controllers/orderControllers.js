import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";

const getUserOrders = asyncHandler(async (req, res) => {
  const { user_id } = req.query;
  console.log(req.query);
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
